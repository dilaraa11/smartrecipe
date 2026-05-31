import { json } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import { getDb } from '$lib/server/db';
import { getSessionUserId } from '$lib/server/session';
import type { Cookies } from '@sveltejs/kit';

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
        .map((recipe) => ({ ...recipe, favorite: true })),
    );
  } catch (error) {
    console.error(error);
    return json({ error: 'Fehler beim Laden der Favoriten' }, { status: 500 });
  }
}
