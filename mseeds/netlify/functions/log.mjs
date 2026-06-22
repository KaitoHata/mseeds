export default async function(req) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const body = await req.json();
    const scriptUrl = process.env.APPS_SCRIPT_URL;

    if (!scriptUrl) {
      // 未設定の場合はスキップ（エラーにしない）
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: process.env.LOG_TOKEN || '', ...body }),
      redirect: 'follow'
    });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    // ログ失敗はユーザーに見せない
    return new Response(JSON.stringify({ ok: false }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export const config = { path: '/api/log' };
