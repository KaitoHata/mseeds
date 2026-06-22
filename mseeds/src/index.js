async function handleGenerate(request, env) {
  try {
    const body = await request.json();
    const res = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: { message: err.message } }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleLog(request, env) {
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

function handleConfig(env) {
  return new Response(JSON.stringify({
    logUrl:   env.APPS_SCRIPT_URL || '',
    logToken: env.LOG_TOKEN       || ''
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export default {
  async fetch(request, env) {
    const url    = new URL(request.url);
    const path   = url.pathname;
    const method = request.method;

    if (path === '/api/generate' && method === 'POST') return handleGenerate(request, env);
    if (path === '/api/log'      && method === 'POST') return handleLog(request, env);
    if (path === '/api/config')                        return handleConfig(env);

    // それ以外はすべて静的ファイル（index.html, sw.js 等）を返す
    return env.ASSETS.fetch(request);
  }
};
