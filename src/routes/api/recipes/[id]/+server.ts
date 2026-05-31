import { json } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import { getDb } from '$lib/server/db';
import { getSessionUserId } from '$lib/server/session';
import type { Cookies } from '@sveltejs/kit';

function normalizeRecipe(recipe: any) {
  const tags = recipe.tags ?? recipe.kategorien ?? [];
  const ingredients = recipe.ingredients ?? recipe.zutaten ?? [];

  return {
    _id: recipe._id,
    title: recipe.title ?? recipe.rezeptname ?? 'Unbenanntes Rezept',
    time: recipe.time ?? recipe.dauer_in_minuten ?? 0,
    difficulty: recipe.difficulty ?? recipe.schwierigkeit ?? 'Einfach',
    tags,
    ingredients: ingredients.map((ingredient: string | { name?: string }) =>
      typeof ingredient === 'string' ? ingredient : ingredient.name ?? '',
    ),
    ingredientAmounts: ingredients
      .filter((ingredient: string | { name?: string }) => typeof ingredient !== 'string')
      .map(
        (ingredient: {
          name?: string;
          menge_2_personen?: string;
          menge_4_personen?: string;
        }) => ({
          name: ingredient.name ?? '',
          amount2: ingredient.menge_2_personen ?? '',
          amount4: ingredient.menge_4_personen ?? '',
        }),
      ),
    emoji: recipe.emoji ?? '',
    imageUrl: recipe.imageUrl ?? recipe.image_url ?? recipe.bildUrl ?? recipe.bild_url ?? '',
    category: recipe.category ?? tags[0] ?? '',
    instructions: recipe.instructions ?? recipe.zubereitung ?? '',
    favorite: recipe.favorite ?? false,
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
    const favorite = userId
      ? Boolean(
          await db.collection('favorites').findOne({
            userId,
            recipeId: recipe._id.toString(),
          }),
        )
      : false;

    return json({ ...normalizeRecipe(recipe), favorite });
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

    if (!userId) {
      return json(
        { error: 'Bitte einloggen, um Favoriten zu speichern.' },
        { status: 401 },
      );
    }

    const db = await getDb();
    const data = await request.json();
    const favorite = Boolean(data.favorite);
    const recipeId = params.id;
    const recipe = await db.collection('recipes').findOne({
      _id: new ObjectId(recipeId),
    });

    if (!recipe) {
      return json({ error: 'Rezept nicht gefunden' }, { status: 404 });
    }

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
  } catch (error) {
    console.error(error);
    return json(
      { error: 'Fehler beim Aktualisieren des Rezepts' },
      { status: 500 },
    );
  }
}
