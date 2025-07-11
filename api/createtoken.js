import { randomBytes } from "crypto";

let tokens = {}; // In-memory storage — reset on redeploy, replace with DB in prod
let keys = {};

function makeRandomString(length = 24) {
  return randomBytes(length).toString("hex");
}

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // You could add user validation here (e.g., API key, session)

  const userId = req.body.userId || "guest"; // Accept userId or default guest

  // Generate unique token
  const token = makeRandomString(12);

  // Save token with usage 1
  tokens[token] = { userId, used: false };

  res.status(200).json({ token });
}
