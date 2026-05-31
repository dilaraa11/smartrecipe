import { json } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { getSessionUserId } from '$lib/server/session';
import type { Cookies } from '@sveltejs/kit';

export async function GET() {
  try {
    const db = await getDb();

    const recipes = await db
      .collection('recipes')
      .find({})
      .limit(150)
      .toArray();

    return json(recipes);
  } catch (error) {
    console.error(error);
    return json({ error: 'Fehler beim Laden der Rezepte' }, { status: 500 });
  }
}

export async function POST({
  request,
  cookies,
}: {
  request: Request;
  cookies: Cookies;
}) {
  try {
    const userId = getSessionUserId(cookies);

    if (!userId) {
      return json(
        { error: 'Bitte einloggen, um Rezepte zu erstellen.' },
        { status: 401 },
      );
    }

    const db = await getDb();
    const recipe = await request.json();

    const newRecipe = {
      ...recipe,
      favorite: false,
      createdBy: userId,
      createdAt: new Date().toISOString()
    };

    const result = await db.collection('recipes').insertOne(newRecipe);

    return json({
      success: true,
      insertedId: result.insertedId
    });
  } catch (error) {
    console.error(error);
    return json({ error: 'Fehler beim Speichern des Rezepts' }, { status: 500 });
  }
}
