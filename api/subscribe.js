const { getRedis, getRatelimit, clientIp } = require("./_lib/clients");

// Newsletter signup. Emails live in a Redis set (dedupes for free) plus a hash
// with the signup time + source, so you can export them later for any mailer.
module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { success } = await getRatelimit().limit(clientIp(req));
    if (!success) {
      res.status(429).json({ error: "Too many requests. Please try again in a moment." });
      return;
    }
  } catch (e) {
    console.error("[subscribe] rate limit check failed", e);
  }

  const { email, source } = req.body || {};
  const clean = typeof email === "string" ? email.trim().toLowerCase().slice(0, 254) : "";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean)) {
    res.status(400).json({ error: "Please enter a valid email." });
    return;
  }

  try {
    const redis = getRedis();
    const added = await redis.sadd("ilmano:subscribers", clean);
    if (added) {
      await redis.hset("ilmano:subscriber-meta", {
        [clean]: JSON.stringify({
          at: new Date().toISOString(),
          source: typeof source === "string" ? source.slice(0, 30) : "unknown",
        }),
      });
    }
    res.status(200).json({ ok: true });
  } catch (e) {
    console.error("[subscribe] redis write failed", e);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};
