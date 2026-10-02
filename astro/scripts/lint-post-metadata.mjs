import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {
  buildMetadataWarning,
  formatMetadataWarning,
} from '../src/lib/post-metadata-validator.mjs';

const CONTENT_ROOT = path.resolve(import.meta.dirname, '../src/content/posts');
const MARKDOWN_EXTENSIONS = new Set(['.md', '.mdx']);

function parseArgs(argv) {
  const files = [];
  let auto = false;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--auto') {
      auto = true;
      continue;
    }

    if (arg === '--file') {
      const value = argv[i + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('Missing value for --file');
      }
      files.push(value);
      i += 1;
      continue;
    }

    if (!arg.startsWith('--')) {
      files.push(arg);
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return { auto, files };
}

async function listMarkdownFiles(rootDir) {
  const files = [];
  const stack = [rootDir];

  while (stack.length > 0) {
    const current = stack.pop();
    const entries = await readdir(current, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }
      if (!entry.isFile()) continue;

      const ext = path.extname(entry.name).toLowerCase();
      if (MARKDOWN_EXTENSIONS.has(ext)) {
        files.push(fullPath);
      }
    }
  }

  return files.sort();
}

async function resolveInputFiles(inputFiles) {
  if (inputFiles.length === 0) {
    return listMarkdownFiles(CONTENT_ROOT);
  }

  const resolved = [];

  for (const fileArg of inputFiles) {
    const absolute = path.isAbsolute(fileArg)
      ? fileArg
      : path.resolve(process.cwd(), fileArg);
    await access(absolute);
    resolved.push(absolute);
  }

  return resolved;
}

const { auto, files: requestedFiles } = parseArgs(process.argv.slice(2));
const aiAssisted = process.env.AI_ASSISTED_POST === '1';

if (auto && !aiAssisted) {
  console.log(
    '[post-metadata] Skipping automatic metadata check because AI_ASSISTED_POST is not set to 1.',
  );
  process.exit(0);
}

const targetFiles = await resolveInputFiles(requestedFiles);
const warnings = [];

for (const absoluteFile of targetFiles) {
  const markdown = await readFile(absoluteFile, 'utf8');
  const displayPath = path.relative(process.cwd(), absoluteFile) || absoluteFile;
  const warning = buildMetadataWarning(displayPath, markdown);
  if (warning) warnings.push(warning);
}

for (const warning of warnings) {
  console.warn(formatMetadataWarning(warning));
}

if (warnings.length > 0) {
  console.warn(
    `[post-metadata] Found ${warnings.length} warning(s). Continuing (warning-only mode).`,
  );
} else {
  console.log('[post-metadata] No metadata warnings found.');
}
