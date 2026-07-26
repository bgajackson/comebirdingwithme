// This Worker does two things:
// 1. Handles GitHub OAuth login for Decap CMS, at /api/auth and /api/auth/callback
// 2. Serves the built static site (from _site) for every other request

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/auth") {
      return handleAuthStart(url, env);
    }

    if (url.pathname === "/api/auth/callback") {
      return handleAuthCallback(url, env);
    }

    // Everything else: serve the static site
    return env.ASSETS.fetch(request);
  },
};

function handleAuthStart(url, env) {
  const redirectUri = `${url.origin}/api/auth/callback`;

  const authUrl = new URL("https://github.com/login/oauth/authorize");
  authUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", "repo");

  return Response.redirect(authUrl.toString(), 302);
}

async function handleAuthCallback(url, env) {
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("Missing OAuth code from GitHub.", { status: 400 });
  }

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const tokenData = await tokenResponse.json();

  if (tokenData.error) {
    return new Response(
      `GitHub authentication error: ${tokenData.error_description || tokenData.error}`,
      { status: 401 }
    );
  }

  const payload = JSON.stringify({ token: tokenData.access_token, provider: "github" });

  const html = `<!doctype html>
<html>
<body>
<script>
(function() {
  function receiveMessage(e) {
    window.opener.postMessage(
      'authorization:github:success:${payload}',
      e.origin
    );
    window.removeEventListener("message", receiveMessage, false);
  }
  window.addEventListener("message", receiveMessage, false);
  window.opener.postMessage("authorizing:github", "*");
})();
</script>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}
