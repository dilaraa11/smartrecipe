import { json } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import { getDb } from '$lib/server/db';
import { getSessionUserId } from '$lib/server/session';
import type { Cookies } from '@sveltejs/kit';

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

    return json({ ...recipe, favorite });
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
