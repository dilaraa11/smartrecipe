import { json } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import { getDb } from '$lib/server/db';
import { cookieName, verifySessionToken } from '$lib/server/session';

export async function GET({ cookies }: { cookies: import('@sveltejs/kit').Cookies }) {
  const token = cookies.get(cookieName);

  if (!token) {
    return json({ user: null });
  }

  const userId = verifySessionToken(token);

  if (!userId || !ObjectId.isValid(userId)) {
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
      },
    });
  } catch (error) {
    console.error(error);
    return json({ user: null }, { status: 500 });
  }
}
