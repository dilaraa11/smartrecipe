import { json } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import { getDb } from '$lib/server/db';
import { getSessionUserId } from '$lib/server/session';
import type { Cookies } from '@sveltejs/kit';

function scaleAmount(amount: string, factor: number) {
  const match = amount.match(/(\d+(?:[.,]\d+)?)/);

  if (!match) {
    return amount;
  }

  const originalNumber = match[1];
  const scaled = Number(originalNumber.replace(',', '.')) * factor;
  const formatted = Number.isInteger(scaled)
    ? String(scaled)
    : scaled.toFixed(1).replace(/\.0$/, '');
  const localized = originalNumber.includes(',')
    ? formatted.replace('.', ',')
    : formatted;

  return amount.replace(originalNumber, localized);
}

function getIngredientAmounts(
  ingredients: (string | {
    name?: string;
    amount?: string;
    menge_2_personen?: string;
    menge_4_personen?: string;
  })[],
  baseServings: 2 | 4,
) {
  return ingredients
    .filter((ingredient) => typeof ingredient !== 'string')
    .map((ingredient) => {
      if (ingredient.menge_2_personen || ingredient.menge_4_personen) {
        return {
          name: ingredient.name ?? '',
          amount2: ingredient.menge_2_personen ?? '',
          amount4: ingredient.menge_4_personen ?? '',
        };
      }

      const amount = ingredient.amount ?? '';

      return {
        name: ingredient.name ?? '',
        amount2: baseServings === 2 ? amount : scaleAmount(amount, 0.5),
        amount4: baseServings === 4 ? amount : scaleAmount(amount, 2),
      };
    });
}

function normalizeRecipe(recipe: any) {
  const tags = recipe.tags ?? recipe.kategorien ?? [];
  const ingredients = recipe.ingredients ?? recipe.zutaten ?? [];
  const baseServings = recipe.baseServings === 4 ? 4 : 2;
  const ingredientDetails = ingredients
    .filter((ingredient: string | { name?: string }) => typeof ingredient !== 'string')
    .map(
      (ingredient: {
        name?: string;
        amount?: string;
        menge_2_personen?: string;
        menge_4_personen?: string;
      }) => ({
        name: ingredient.name ?? '',
        amount:
          ingredient.amount ??
          (baseServings === 2
            ? ingredient.menge_2_personen
            : ingredient.menge_4_personen) ??
          '',
      }),
    );

  return {
    _id: recipe._id,
    title: recipe.title ?? recipe.rezeptname ?? 'Unbenanntes Rezept',
    time: recipe.time ?? recipe.dauer_in_minuten ?? 0,
    difficulty: recipe.difficulty ?? recipe.schwierigkeit ?? 'Einfach',
    tags,
    ingredients: ingredients.map((ingredient: string | { name?: string }) =>
      typeof ingredient === 'string' ? ingredient : ingredient.name ?? '',
    ),
    ingredientDetails,
    ingredientAmounts: getIngredientAmounts(ingredients, baseServings),
    emoji: recipe.emoji ?? '',
    imageUrl: recipe.imageUrl ?? recipe.image_url ?? recipe.bildUrl ?? recipe.bild_url ?? '',
    category: recipe.category ?? tags[0] ?? '',
    baseServings,
    instructions: recipe.instructions ?? recipe.zubereitung ?? '',
    favorite: recipe.favorite ?? false,
    createdByUsername: recipe.createdByUsername ?? '',
  };
}

type RouteParams = {
  params: {
    id: string;
  };
};

type RouteRequest = RouteParams & {
  cookies: Cookies;
};

type PatchRequest = RouteRequest & {
  request: Request;
};

export async function GET({ params, cookies }: RouteRequest) {
  try {
    if (!ObjectId.isValid(params.id)) {
      return json({ error: 'Ungueltige Rezept-ID' }, { status: 400 });
    }

    const db = await getDb();
    const recipe = await db.collection('recipes').findOne({
      _id: new ObjectId(params.id),
    });

    if (!recipe) {
      return json({ error: 'Rezept nicht gefunden' }, { status: 404 });
    }

    const userId = getSessionUserId(cookies);
    let createdByUsername = '';
    const createdByCurrentUser = Boolean(userId && recipe.createdBy === userId);

    if (recipe.createdBy && ObjectId.isValid(recipe.createdBy)) {
      const creator = await db.collection('users').findOne(
        { _id: new ObjectId(recipe.createdBy) },
        { projection: { username: 1, name: 1 } },
      );

      createdByUsername = creator?.username ?? creator?.name ?? '';
    }

    const favorite = userId
      ? Boolean(
          await db.collection('favorites').findOne({
            userId,
            recipeId: recipe._id.toString(),
          }),
        )
      : false;

    return json({
      ...normalizeRecipe(recipe),
      favorite,
      createdByUsername,
      createdByCurrentUser,
    });
  } catch (error) {
    console.error(error);
    return json({ error: 'Fehler beim Laden des Rezepts' }, { status: 500 });
  }
}

export async function PATCH({ params, request, cookies }: PatchRequest) {
  try {
    if (!ObjectId.isValid(params.id)) {
      return json({ error: 'Ungueltige Rezept-ID' }, { status: 400 });
    }

    const userId = getSessionUserId(cookies);

    const db = await getDb();
    const data = await request.json();
    const recipeId = params.id;
    const recipe = await db.collection('recipes').findOne({
      _id: new ObjectId(recipeId),
    });

    if (!recipe) {
      return json({ error: 'Rezept nicht gefunden' }, { status: 404 });
    }

    if (!userId) {
      return json(
        { error: 'Bitte einloggen, um Rezepte zu aktualisieren.' },
        { status: 401 },
      );
    }

    if (typeof data.favorite === 'boolean') {
      const favorite = data.favorite;

      await db.collection('favorites').createIndex(
        { userId: 1, recipeId: 1 },
        { unique: true },
      );

      if (favorite) {
        await db.collection('favorites').updateOne(
          { userId, recipeId },
          {
            $set: {
              userId,
              recipeId,
              createdAt: new Date().toISOString(),
            },
          },
          { upsert: true },
        );
      } else {
        await db.collection('favorites').deleteOne({ userId, recipeId });
      }

      return json({ success: true, favorite });
    }

    if (recipe.createdBy !== userId) {
      return json(
        { error: 'Du kannst nur eigene Rezepte bearbeiten.' },
        { status: 403 },
      );
    }

    const title = String(data.title ?? '').trim();
    const time = Number(data.time);
    const difficulty = ['Einfach', 'Mittel', 'Schwer'].includes(data.difficulty)
      ? data.difficulty
      : 'Einfach';
    const tags = Array.isArray(data.tags)
      ? data.tags
          .map((tag: unknown) => String(tag).trim())
          .filter((tag: string) => tag.length > 0)
      : [];
    const baseServings = data.baseServings === 4 ? 4 : 2;
    const ingredients = Array.isArray(data.ingredients)
      ? data.ingredients
          .map((ingredient: { name?: unknown; amount?: unknown }) => ({
            name: String(ingredient.name ?? '').trim(),
            amount: String(ingredient.amount ?? '').trim(),
          }))
          .filter((ingredient) => ingredient.name && ingredient.amount)
      : [];
    const instructions = String(data.instructions ?? '').trim();

    if (!title || !time || time <= 0 || ingredients.length === 0 || !instructions) {
      return json(
        {
          error:
            'Bitte fülle Rezeptname, Dauer, Zutaten, Menge und Zubereitung aus.',
        },
        { status: 400 },
      );
    }

    await db.collection('recipes').updateOne(
      { _id: new ObjectId(recipeId), createdBy: userId },
      {
        $set: {
          title,
          time,
          difficulty,
          tags,
          category: tags[0] ?? '',
          baseServings,
          ingredients,
          imageUrl: String(data.imageUrl ?? ''),
          instructions,
          updatedAt: new Date().toISOString(),
        },
      },
    );

    return json({ success: true });
  } catch (error) {
    console.error(error);
    return json(
      { error: 'Fehler beim Aktualisieren des Rezepts' },
      { status: 500 },
    );
  }
}

export async function DELETE({ params, cookies }: RouteRequest) {
  try {
    if (!ObjectId.isValid(params.id)) {
      return json({ error: 'Ungueltige Rezept-ID' }, { status: 400 });
    }

    const userId = getSessionUserId(cookies);

    if (!userId) {
      return json(
        { error: 'Bitte einloggen, um Rezepte zu löschen.' },
        { status: 401 },
      );
    }

    const db = await getDb();
    const recipeId = params.id;
    const recipe = await db.collection('recipes').findOne({
      _id: new ObjectId(recipeId),
    });

    if (!recipe) {
      return json({ error: 'Rezept nicht gefunden' }, { status: 404 });
    }

    if (recipe.createdBy !== userId) {
      return json(
        { error: 'Du kannst nur eigene Rezepte löschen.' },
        { status: 403 },
      );
    }

    await db.collection('recipes').deleteOne({
      _id: new ObjectId(recipeId),
      createdBy: userId,
    });
    await db.collection('favorites').deleteMany({ recipeId });

    return json({ success: true });
  } catch (error) {
    console.error(error);
    return json({ error: 'Fehler beim Löschen des Rezepts' }, { status: 500 });
  }
}
