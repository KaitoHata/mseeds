export async function onRequest(context) {
  const { env } = context;

  return new Response(JSON.stringify({
    logUrl:   env.APPS_SCRIPT_URL || '',
    logToken: env.LOG_TOKEN       || ''
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
