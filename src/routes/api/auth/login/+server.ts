import { json } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { verifyPassword } from '$lib/server/password';
import { setSessionCookie } from '$lib/server/session';
import type { Cookies } from '@sveltejs/kit';

type LoginRequest = {
  email?: string;
  identifier?: string;
  password?: string;
};

export async function POST({
  request,
  cookies,
}: {
  request: Request;
  cookies: Cookies;
}) {
  try {
    const body = (await request.json()) as LoginRequest;
    const identifier = (body.identifier ?? body.email ?? '').trim().toLowerCase();
    const password = body.password ?? '';

    if (!identifier || !password) {
      return json(
        { error: 'Bitte E-Mail oder Benutzername und Passwort eingeben.' },
        { status: 400 },
      );
    }

    const db = await getDb();
    const user = await db.collection('users').findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return json(
        { error: 'E-Mail, Benutzername oder Passwort ist falsch.' },
        { status: 401 },
      );
    }

    const lastLoginAt = new Date().toISOString();

    await db.collection('users').updateOne(
      { _id: user._id },
      { $set: { lastLoginAt } },
    );

    setSessionCookie(cookies, user._id.toString());

    return json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username ?? user.name,
        lastLoginAt,
      },
    });
  } catch (error) {
    console.error(error);
    return json({ error: 'Login fehlgeschlagen.' }, { status: 500 });
  }
}
