import { json } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { verifyPassword } from '$lib/server/password';
import { setSessionCookie } from '$lib/server/session';
import type { Cookies } from '@sveltejs/kit';

type LoginRequest = {
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
    const body = (await request.json()) as LoginRequest;
    const email = normalizeEmail(body.email ?? '');
    const password = body.password ?? '';

    if (!email || !password) {
      return json(
        { error: 'Bitte E-Mail und Passwort eingeben.' },
        { status: 400 },
      );
    }

    const db = await getDb();
    const user = await db.collection('users').findOne({ email });

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return json(
        { error: 'E-Mail oder Passwort ist falsch.' },
        { status: 401 },
      );
    }

    setSessionCookie(cookies, user._id.toString());

    return json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return json({ error: 'Login fehlgeschlagen.' }, { status: 500 });
  }
}
