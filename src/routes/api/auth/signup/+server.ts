import { json } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { hashPassword } from '$lib/server/password';
import { setSessionCookie } from '$lib/server/session';
import type { Cookies } from '@sveltejs/kit';

type SignupRequest = {
  name?: string;
  email?: string;
  password?: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
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
    const name = body.name?.trim() ?? '';
    const email = normalizeEmail(body.email ?? '');
    const password = body.password ?? '';

    if (!name || !email || !password) {
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

    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return json(
        { error: 'Mit dieser E-Mail gibt es bereits ein Konto.' },
        { status: 409 },
      );
    }

    const result = await users.insertOne({
      name,
      email,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
    });

    setSessionCookie(cookies, result.insertedId.toString());

    return json({
      success: true,
      user: {
        id: result.insertedId,
        name,
        email,
      },
    });
  } catch (error) {
    console.error(error);
    return json({ error: 'Registrierung fehlgeschlagen.' }, { status: 500 });
  }
}
