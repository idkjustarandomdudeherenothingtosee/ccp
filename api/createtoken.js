import axios from "axios";
import { randomBytes } from "crypto";

const OWNER = "your-github-username"; // ← Replace with your GitHub username
const REPO = "your-repo-name"; // ← Replace with your repo name
const BRANCH = "main"; // Or your default branch

// 👇 Uses your new env variable name
const GITHUB_TOKEN = process.env.SUPER_TOKEN;

function makeRandomToken(length = 16) {
  return randomBytes(length).toString("hex");
}

async function getFileSha(path) {
  try {
    const res = await axios.get(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    return res.data.sha;
  } catch (err) {
    // If file not found, we return null so it will create a new one
    return null;
  }
}

async function updateOrCreateFile(path, contentBase64, sha = null) {
  const message = sha
    ? `Update token file ${path}`
    : `Create token file ${path}`;

  const body = {
    message,
    content: contentBase64,
    branch: BRANCH,
  };

  if (sha) {
    body.sha = sha;
  }

  const res = await axios.put(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`,
    body,
    {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  return res.data;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Only POST allowed" });
    return;
  }

  const { userId } = req.body;

  if (!userId || typeof userId !== "string") {
    res.status(400).json({ error: "Missing or invalid userId" });
    return;
  }

  const token = makeRandomToken(12);

  const path = `tokens/${userId}.json`;
  const fileContent = {
    user: userId,
    token,
    createdAt: new Date().toISOString(),
  };

  const contentBase64 = Buffer.from(JSON.stringify(fileContent, null, 2)).toString("base64");

  try {
    const sha = await getFileSha(path);
    await updateOrCreateFile(path, contentBase64, sha);

    res.status(200).json({ token });
  } catch (error) {
    console.error("GitHub API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to write token file" });
  }
}
