import { access, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

function parseArgs(argv) {
  const options = {
    legacyRoot: path.resolve(import.meta.dirname, '../../content'),
    astroRoot: path.resolve(import.meta.dirname, '../src/content/posts'),
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const value = argv[i + 1];

    if (arg === '--legacy-root') {
      if (!value || value.startsWith('--')) {
        throw new Error('Missing value for --legacy-root');
      }
      options.legacyRoot = path.resolve(process.cwd(), value);
      i += 1;
      continue;
    }

    if (arg === '--astro-root') {
      if (!value || value.startsWith('--')) {
        throw new Error('Missing value for --astro-root');
      }
      options.astroRoot = path.resolve(process.cwd(), value);
      i += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

async function exists(dirPath) {
  try {
    await access(dirPath);
    return true;
  } catch {
    return false;
  }
}

async function listFiles(dirPath, predicate) {
  const entries = await readdir(dirPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && predicate(entry.name))
    .map((entry) => entry.name)
    .sort();
}

const { legacyRoot, astroRoot } = parseArgs(process.argv.slice(2));

if (!(await exists(legacyRoot))) {
  console.log(`[parity] Legacy content root not found: ${legacyRoot}`);
  console.log('[parity] No legacy content parity checks required.');
  process.exit(0);
}

if (!(await exists(astroRoot))) {
  console.error(`[parity] Astro posts root not found: ${astroRoot}`);
  process.exit(1);
}

const legacyPosts = await listFiles(legacyRoot, (name) => name.endsWith('.md'));
const astroPosts = new Set(
  await listFiles(astroRoot, (name) => name.endsWith('.md') || name.endsWith('.mdx')),
);

const missing = [];

for (const legacyFile of legacyPosts) {
  const stem = legacyFile.replace(/\.md$/i, '');
  const mdName = `${stem}.md`;
  const mdxName = `${stem}.mdx`;
  if (!astroPosts.has(mdName) && !astroPosts.has(mdxName)) {
    missing.push(legacyFile);
  }
}

if (missing.length > 0) {
  console.error('[parity] Legacy posts missing Astro counterparts:');
  for (const file of missing) {
    console.error(` - ${file}`);
  }
  console.error(`[parity] FAIL ${missing.length} missing counterpart(s).`);
  process.exit(1);
}

console.log(
  `[parity] PASS ${legacyPosts.length} legacy post(s) have Astro counterparts in ${astroRoot}.`,
);
