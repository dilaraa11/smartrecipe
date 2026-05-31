import { json } from '@sveltejs/kit';
import { clearSessionCookie } from '$lib/server/session';
import type { Cookies } from '@sveltejs/kit';

export async function POST({ cookies }: { cookies: Cookies }) {
  clearSessionCookie(cookies);

  return json({ success: true });
}
