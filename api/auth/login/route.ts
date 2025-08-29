import { cookies } from 'next/headers';

const DEMO_USER = {
  email: 'demo@mastrohub.local',
  password: 'demo1234',
};

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let email = '';
    let password = '';

    if (contentType.includes('application/json')) {
      const body = await req.json();
      email = (body?.email || '').toString();
      password = (body?.password || '').toString();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const bodyText = await req.text();
      const params = new URLSearchParams(bodyText);
      email = (params.get('email') || '').toString();
      password = (params.get('password') || '').toString();
    } else {
      // fallback: query params
      const u = new URL(req.url);
      email = (u.searchParams.get('email') || '').toString();
      password = (u.searchParams.get('password') || '').toString();
    }

    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      const jar = cookies();
      const maxAge = 60 * 60 * 24; // 1 day
      jar.set('mhv2_auth', 'ok', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge,
      });
      return Response.json({ ok: true, user: { email } }, { status: 200 });
    }

    return Response.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
  } catch {
    return Response.json({ ok: false, error: 'Bad request' }, { status: 400 });
  }
}

export const GET = () =>
  new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
