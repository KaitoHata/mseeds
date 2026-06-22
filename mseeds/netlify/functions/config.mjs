export default async function() {
  return new Response(JSON.stringify({
    logUrl:   process.env.APPS_SCRIPT_URL || '',
    logToken: process.env.LOG_TOKEN       || ''
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export const config = { path: '/api/config' };
