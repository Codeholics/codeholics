import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {
  analyzeInlineCodeDelimiters,
  formatInlineCodeDiagnostic,
} from '../src/lib/inline-code-quality.mjs';

const MODE = process.env.INLINE_CODE_LINT_MODE === 'error' ? 'error' : 'warn';
const CONTENT_ROOT = path.resolve(import.meta.dirname, '../src/content/posts');
const MARKDOWN_EXTENSIONS = new Set(['.md', '.mdx']);

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

      if (!entry.isFile()) {
        continue;
      }

      const ext = path.extname(entry.name).toLowerCase();
      if (MARKDOWN_EXTENSIONS.has(ext)) {
        files.push(fullPath);
      }
    }
  }

  return files.sort();
}

function printDiagnostics(filePath, diagnostics) {
  for (const diagnostic of diagnostics) {
    const line = diagnostic.lineOffset + 1;
    console.warn(
      formatInlineCodeDiagnostic({
        filePath,
        line,
        kind: diagnostic.kind,
        message: diagnostic.message,
      }),
    );
  }
}

function sanitizeNonProseMarkdown(text) {
  const lines = text.split('\n');
  const sanitized = [];
  let inFence = false;
  let fenceChar = '';
  let fenceLen = 0;
  let inFrontmatter = lines[0]?.trim() === '---';

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();

    if (inFrontmatter) {
      sanitized.push('');
      if (i > 0 && trimmed === '---') {
        inFrontmatter = false;
      }
      continue;
    }

    if (!inFence) {
      const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);
      if (fenceMatch) {
        inFence = true;
        fenceChar = fenceMatch[1][0];
        fenceLen = fenceMatch[1].length;
        sanitized.push('');
        continue;
      }
    } else {
      const closingRe = new RegExp(`^\\s*${fenceChar}{${fenceLen},}\\s*$`);
      sanitized.push('');
      if (closingRe.test(line)) {
        inFence = false;
        fenceChar = '';
        fenceLen = 0;
      }
      continue;
    }

    sanitized.push(line);
  }

  return sanitized.join('\n');
}

const files = await listMarkdownFiles(CONTENT_ROOT);
let totalDiagnostics = 0;

for (const filePath of files) {
  const text = await readFile(filePath, 'utf8');
  const proseOnly = sanitizeNonProseMarkdown(text);
  const result = analyzeInlineCodeDelimiters(proseOnly, { applyFixes: false });

  if (result.diagnostics.length === 0) {
    continue;
  }

  totalDiagnostics += result.diagnostics.length;
  printDiagnostics(filePath, result.diagnostics);
}

if (totalDiagnostics > 0) {
  const summary =
    `[inline-code] Found ${totalDiagnostics} inline-code delimiter issue(s). Mode=${MODE}.`;

  if (MODE === 'error') {
    console.error(`${summary} Failing because INLINE_CODE_LINT_MODE=error.`);
    process.exit(1);
  }

  console.warn(`${summary} Continuing because INLINE_CODE_LINT_MODE=warn.`);
} else {
  console.log(`[inline-code] No inline-code delimiter issues found. Mode=${MODE}.`);
}
