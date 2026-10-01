// Step 2 of the CMS login: GitHub sends the editor back here with a code. We swap it for a
// token (the client secret never reaches the browser) and hand it to the Decap popup opener.
// GitHub itself decides who may save: only people with write access to the repo can commit.
const post = (status, message, content) => `<!doctype html><html><body><script>
(function () {
  function receive(e) {
    window.opener.postMessage("authorization:github:${status}:" + ${JSON.stringify(JSON.stringify(content))}, e.origin);
    window.removeEventListener("message", receive, false);
  }
  window.addEventListener("message", receive, false);
  window.opener.postMessage("authorizing:github", "*");
})();
</script><p>${message}</p></body></html>`;

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  const { code, state } = req.query || {};
  const saved = /(?:^|;\s*)cms_oauth_state=([a-f0-9]+)/.exec(req.headers.cookie || "")?.[1];
  res.setHeader("Set-Cookie", "cms_oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=0");
  if (!code || !state || state !== saved) {
    res.status(400).send(post("error", "Login expired — close this window and try again.", { message: "Invalid OAuth state" }));
    return;
  }
  try {
    const r = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        client_id: process.env.GITHUB_OAUTH_ID,
        client_secret: process.env.GITHUB_OAUTH_SECRET,
        code,
      }),
    });
    const body = await r.json();
    if (!body.access_token) throw new Error(body.error_description || body.error || "No token returned");
    res.status(200).send(post("success", "Logged in — you can close this window.", { token: body.access_token, provider: "github" }));
  } catch (e) {
    console.error("[callback] GitHub token exchange failed", e);
    res.status(500).send(post("error", "Login failed — close this window and try again.", { message: String(e.message || e) }));
  }
};
