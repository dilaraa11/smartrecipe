import { json } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import { getDb } from '$lib/server/db';
import { cookieName, verifySessionToken } from '$lib/server/session';
import type { Cookies } from '@sveltejs/kit';

function getUserIdFromCookies(cookies: Cookies) {
  const token = cookies.get(cookieName);

  if (!token) {
    return null;
  }

  const userId = verifySessionToken(token);

  if (!userId || !ObjectId.isValid(userId)) {
    return null;
  }

  return userId;
}

export async function GET({ cookies }: { cookies: Cookies }) {
  const userId = getUserIdFromCookies(cookies);

  if (!userId) {
    return json({ user: null });
  }

  try {
    const db = await getDb();
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(userId) },
      { projection: { passwordHash: 0 } },
    );

    if (!user) {
      return json({ user: null });
    }

    return json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImageUrl: user.profileImageUrl ?? '',
        username: user.username ?? user.name,
        createdAt: user.createdAt ?? '',
        lastLoginAt: user.lastLoginAt ?? '',
      },
    });
  } catch (error) {
    console.error(error);
    return json({ user: null }, { status: 500 });
  }
}

export async function PATCH({
  request,
  cookies,
}: {
  request: Request;
  cookies: Cookies;
}) {
  const userId = getUserIdFromCookies(cookies);

  if (!userId) {
    return json({ error: 'Bitte einloggen, um dein Profil zu bearbeiten.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updates: {
      name?: string;
      email?: string;
      username?: string;
      profileImageUrl?: string;
      updatedAt: string;
    } = {
      updatedAt: new Date().toISOString(),
    };

    const db = await getDb();
    const users = db.collection('users');

    if (typeof body.name === 'string') {
      const name = body.name.trim();

      if (!name) {
        return json({ error: 'Name darf nicht leer sein.' }, { status: 400 });
      }

      updates.name = name;
    }

    if (typeof body.email === 'string') {
      const email = body.email.trim().toLowerCase();

      if (!email) {
        return json({ error: 'E-Mail darf nicht leer sein.' }, { status: 400 });
      }

      const existingUser = await users.findOne({
        email,
        _id: { $ne: new ObjectId(userId) },
      });

      if (existingUser) {
        return json(
          { error: 'Mit dieser E-Mail gibt es bereits ein Konto.' },
          { status: 409 },
        );
      }

      updates.email = email;
    }

    if (typeof body.username === 'string') {
      updates.username = body.username.trim();
    }

    if (typeof body.profileImageUrl === 'string') {
      updates.profileImageUrl = body.profileImageUrl;
    }

    await users.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: updates,
      },
    );

    return json({ success: true });
  } catch (error) {
    console.error(error);
    return json({ error: 'Profil konnte nicht gespeichert werden.' }, { status: 500 });
  }
}
