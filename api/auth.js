// Step 1 of the CMS login: send the editor to GitHub to approve access.
// Needs GITHUB_OAUTH_ID (see .env.example). The callback is api/callback.js.
const crypto = require("crypto");

module.exports = (req, res) => {
  const clientId = process.env.GITHUB_OAUTH_ID;
  if (!clientId) {
    res.status(500).send("CMS login isn't configured: set GITHUB_OAUTH_ID in Vercel and redeploy.");
    return;
  }
  const state = crypto.randomBytes(16).toString("hex");
  res.setHeader("Set-Cookie", `cms_oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=600`);
  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("scope", "repo,user");
  url.searchParams.set("state", state);
  res.redirect(302, url.toString());
};
