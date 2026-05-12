import { json } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import { getDb } from '$lib/server/db';

type RouteParams = {
  params: {
    id: string;
  };
};

type PatchRequest = RouteParams & {
  request: Request;
};

export async function GET({ params }: RouteParams) {
  try {
    if (!ObjectId.isValid(params.id)) {
      return json({ error: 'Ungültige Rezept-ID' }, { status: 400 });
    }

    const db = await getDb();

    const recipe = await db.collection('recipes').findOne({
      _id: new ObjectId(params.id)
    });

    if (!recipe) {
      return json({ error: 'Rezept nicht gefunden' }, { status: 404 });
    }

    return json(recipe);
  } catch (error) {
    console.error(error);
    return json({ error: 'Fehler beim Laden des Rezepts' }, { status: 500 });
  }
}

export async function PATCH({ params, request }: PatchRequest) {
  try {
    if (!ObjectId.isValid(params.id)) {
      return json({ error: 'Ungültige Rezept-ID' }, { status: 400 });
    }

    const db = await getDb();
    const data = await request.json();

    await db.collection('recipes').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: data }
    );

    return json({ success: true });
  } catch (error) {
    console.error(error);
    return json({ error: 'Fehler beim Aktualisieren des Rezepts' }, { status: 500 });
  }
}
