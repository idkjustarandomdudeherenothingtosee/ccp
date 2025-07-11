import { randomBytes } from "crypto";

let tokens = {}; // Should be shared with createtoken.js in prod (DB)
let keys = {};

function makeRandomKey(length = 16) {
  return randomBytes(length).toString("hex");
}

export default function handler(req, res) {
  const { token } = req.query;

  if (!token) {
    res.status(400).json({ error: "Token is required" });
    return;
  }

  // Check if token exists and unused
  if (!tokens[token]) {
    res.status(400).json({ error: "Invalid token" });
    return;
  }
  if (tokens[token].used) {
    res.status(400).json({ error: "Token already used" });
    return;
  }

  // Mark token as used
  tokens[token].used = true;

  // Generate key
  const key = makeRandomKey(12);

  // Save key with creation time
  keys[key] = { createdAt: Date.now(), expiresInMs: 24 * 60 * 60 * 1000 };

  res.status(200).json({ key, expiresInHours: 24 });
}
