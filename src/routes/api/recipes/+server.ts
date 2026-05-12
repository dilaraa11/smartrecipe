import { json } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';

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

export async function POST({ request }: { request: Request }) {
  try {
    const db = await getDb();
    const recipe = await request.json();

    const newRecipe = {
      ...recipe,
      favorite: false,
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
