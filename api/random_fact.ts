import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readFileSync } from 'fs';
import { join } from 'path';

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const factsPath = join(process.cwd(), 'facts.json');
    const factsBuffer = readFileSync(factsPath);
    const facts: string[] = JSON.parse(factsBuffer.toString());

    const fact = facts[Math.floor(Math.random() * facts.length)];

    res.status(200).json({ fact });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load facts' });
  }
}
