const Stripe = require("stripe");
const { Redis } = require("@upstash/redis");
const { Ratelimit } = require("@upstash/ratelimit");
const { Resend } = require("resend");

let _stripe, _redis, _ratelimit, _resend;

function getStripe() {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is not set");
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
  }
  return _stripe;
}

function getRedis() {
  if (!_redis) {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      throw new Error("Upstash Redis env vars are not set");
    }
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return _redis;
}

// 8 requests/minute per IP on the payment-intent endpoint — generous enough for
// a real customer retrying a declined card, tight enough to blunt scripted abuse.
function getRatelimit() {
  if (!_ratelimit) {
    _ratelimit = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(8, "1 m"),
      prefix: "ilmano:ratelimit",
    });
  }
  return _ratelimit;
}

// Optional: order-confirmation email only sends if RESEND_API_KEY is set, so the
// rest of checkout keeps working even before that's configured.
function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

function clientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length) return fwd.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}

module.exports = { getStripe, getRedis, getRatelimit, getResend, clientIp };
