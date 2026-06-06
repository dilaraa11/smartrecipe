import { json } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { hashPassword } from '$lib/server/password';
import { setSessionCookie } from '$lib/server/session';
import type { Cookies } from '@sveltejs/kit';

type SignupRequest = {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  password?: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

export async function POST({
  request,
  cookies,
}: {
  request: Request;
  cookies: Cookies;
}) {
  try {
    const body = (await request.json()) as SignupRequest;
    const firstName = body.firstName?.trim() ?? '';
    const lastName = body.lastName?.trim() ?? '';
    const username = normalizeUsername(body.username ?? '');
    const email = normalizeEmail(body.email ?? '');
    const password = body.password ?? '';
    const name = [firstName, lastName].filter(Boolean).join(' ');

    if (!firstName || !lastName || !username || !email || !password) {
      return json({ error: 'Bitte alle Felder ausfüllen.' }, { status: 400 });
    }

    if (password.length < 8) {
      return json(
        { error: 'Das Passwort muss mindestens 8 Zeichen lang sein.' },
        { status: 400 },
      );
    }

    const db = await getDb();
    const users = db.collection('users');

    await users.createIndex({ email: 1 }, { unique: true });
    await users.createIndex({ username: 1 }, { unique: true });

    const existingUser = await users.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return json(
        {
          error:
            existingUser.email === email
              ? 'Mit dieser E-Mail gibt es bereits ein Konto.'
              : 'Dieser Benutzername ist bereits vergeben.',
        },
        { status: 409 },
      );
    }

    const createdAt = new Date().toISOString();

    const result = await users.insertOne({
      name,
      firstName,
      lastName,
      username,
      email,
      passwordHash: hashPassword(password),
      createdAt,
      lastLoginAt: createdAt,
    });

    setSessionCookie(cookies, result.insertedId.toString());

    return json({
      success: true,
      user: {
        id: result.insertedId,
        name,
        firstName,
        lastName,
        username,
        email,
        createdAt,
        lastLoginAt: createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    return json({ error: 'Registrierung fehlgeschlagen.' }, { status: 500 });
  }
}
