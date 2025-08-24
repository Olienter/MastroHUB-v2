import { cookies } from 'next/headers';

export async function POST() {
  const jar = cookies();
  jar.set('mhv2_auth', '', {
    path: '/',
    maxAge: 0,
  });
  return Response.json({ ok: true });
}

export const GET = () =>
  new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
