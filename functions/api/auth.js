// GET /api/auth
// Starts the GitHub OAuth flow. Decap CMS opens this in a popup when you
// click "Login with GitHub" on the live site.
export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const redirectUri = `${url.origin}/api/auth/callback`;

  const authUrl = new URL("https://github.com/login/oauth/authorize");
  authUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", "repo");

  return Response.redirect(authUrl.toString(), 302);
}
