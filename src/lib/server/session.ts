import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from '$env/dynamic/private';
import type { Cookies } from '@sveltejs/kit';

const cookieName = 'smartrecipe_session';
const maxAge = 60 * 60 * 24 * 7;

function getSecret() {
  return env.AUTH_SECRET || env.MONGODB_URI || 'smartrecipe-dev-secret';
}

function sign(value: string) {
  return createHmac('sha256', getSecret()).update(value).digest('hex');
}

export function createSessionToken(userId: string) {
  const payload = Buffer.from(
    JSON.stringify({
      userId,
      createdAt: Date.now(),
    }),
  ).toString('base64url');

  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string) {
  const [payload, signature] = token.split('.');

  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = sign(payload);
  const signatureBuffer = Buffer.from(signature, 'hex');
  const expectedSignatureBuffer = Buffer.from(expectedSignature, 'hex');

  if (
    signatureBuffer.length !== expectedSignatureBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedSignatureBuffer)
  ) {
    return null;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return typeof session.userId === 'string' ? session.userId : null;
  } catch {
    return null;
  }
}

export function setSessionCookie(cookies: Cookies, userId: string) {
  cookies.set(cookieName, createSessionToken(userId), {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge,
  });
}

export function clearSessionCookie(cookies: Cookies) {
  cookies.delete(cookieName, {
    path: '/',
  });
}

export { cookieName };
