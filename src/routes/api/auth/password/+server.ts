import { json } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import { getDb } from '$lib/server/db';
import { hashPassword, verifyPassword } from '$lib/server/password';
import { getSessionUserId } from '$lib/server/session';
import type { Cookies } from '@sveltejs/kit';

export async function POST({
  request,
  cookies,
}: {
  request: Request;
  cookies: Cookies;
}) {
  try {
    const userId = getSessionUserId(cookies);

    if (!userId || !ObjectId.isValid(userId)) {
      return json(
        { error: 'Bitte einloggen, um dein Passwort zu ändern.' },
        { status: 401 },
      );
    }

    const body = await request.json();
    const currentPassword =
      typeof body.currentPassword === 'string' ? body.currentPassword : '';
    const newPassword =
      typeof body.newPassword === 'string' ? body.newPassword : '';

    if (!currentPassword || !newPassword) {
      return json(
        { error: 'Bitte aktuelles und neues Passwort eingeben.' },
        { status: 400 },
      );
    }

    if (newPassword.length < 8) {
      return json(
        { error: 'Das neue Passwort muss mindestens 8 Zeichen lang sein.' },
        { status: 400 },
      );
    }

    const db = await getDb();
    const user = await db.collection('users').findOne({
      _id: new ObjectId(userId),
    });

    if (!user || !verifyPassword(currentPassword, user.passwordHash)) {
      return json(
        { error: 'Das aktuelle Passwort ist falsch.' },
        { status: 401 },
      );
    }

    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          passwordHash: hashPassword(newPassword),
          updatedAt: new Date().toISOString(),
        },
      },
    );

    return json({ success: true });
  } catch (error) {
    console.error(error);
    return json({ error: 'Passwort konnte nicht geändert werden.' }, { status: 500 });
  }
}
