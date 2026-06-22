export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const scriptUrl = env.APPS_SCRIPT_URL;

    if (!scriptUrl) {
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: env.LOG_TOKEN || '', ...body }),
      redirect: 'follow'
    });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ ok: false }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
