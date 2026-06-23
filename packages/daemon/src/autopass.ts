import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

const autoPassSet = new Set<string>();

if (existsSync('autopass.txt')) {
  const lines = (await readFile('autopass.txt', 'utf-8')).split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed) {
      autoPassSet.add(trimmed);
    }
  }
} else {
  console.warn('autopass.txt not found, no users will be auto-approved');
}

export default autoPassSet;
