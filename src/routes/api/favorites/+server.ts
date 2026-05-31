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
    favorite: true,
  };
}

export async function GET({ cookies }: { cookies: Cookies }) {
  try {
    const userId = getSessionUserId(cookies);

    if (!userId) {
      return json(
        { error: 'Bitte einloggen, um Favoriten zu sehen.' },
        { status: 401 },
      );
    }

    const db = await getDb();
    const favorites = await db
      .collection('favorites')
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
    const recipeIds = favorites
      .map((favorite) => favorite.recipeId)
      .filter((recipeId) => ObjectId.isValid(recipeId))
      .map((recipeId) => new ObjectId(recipeId));

    if (recipeIds.length === 0) {
      return json([]);
    }

    const recipes = await db
      .collection('recipes')
      .find({ _id: { $in: recipeIds } })
      .toArray();
    const recipeById = new Map(
      recipes.map((recipe) => [recipe._id.toString(), recipe]),
    );

    return json(
      favorites
        .map((favorite) => recipeById.get(favorite.recipeId))
        .filter(Boolean)
        .map((recipe) => normalizeRecipe(recipe)),
    );
  } catch (error) {
    console.error(error);
    return json({ error: 'Fehler beim Laden der Favoriten' }, { status: 500 });
  }
}
