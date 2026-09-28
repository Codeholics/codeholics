import { visit } from 'unist-util-visit';
import { analyzeInlineCodeDelimiters } from './inline-code-quality.mjs';

const LANGUAGE_ALIASES = {
  cplusplus: 'cpp',
  csharp: 'cs',
  docker: 'dockerfile',
  html5: 'html',
  js: 'javascript',
  jsx: 'javascript',
  md: 'markdown',
  py: 'python',
  py3: 'python',
  python3: 'python',
  shell: 'bash',
  sh: 'bash',
  ts: 'typescript',
  tsx: 'typescript',
  yml: 'yaml',
  zsh: 'bash',
};

const SUPPORTED_LANGUAGES = new Set([
  'bash',
  'c',
  'cpp',
  'cs',
  'css',
  'diff',
  'dockerfile',
  'go',
  'html',
  'ini',
  'javascript',
  'java',
  'json',
  'lua',
  'make',
  'markdown',
  'plaintext',
  'python',
  'rust',
  'scss',
  'sql',
  'text',
  'toml',
  'typescript',
  'xml',
  'yaml',
]);

function normalizeCodeLanguage(label) {
  if (!label) {
    return { language: 'text', normalized: false, unknown: null };
  }

  const lower = label.trim().toLowerCase();
  const mapped = LANGUAGE_ALIASES[lower] ?? lower;

  if (SUPPORTED_LANGUAGES.has(mapped)) {
    return { language: mapped, normalized: mapped !== label, unknown: null };
  }

  return { language: 'text', normalized: true, unknown: label };
}

export const canonicalCodeLanguages = Object.freeze([...SUPPORTED_LANGUAGES].sort());
export const codeLanguageAliases = Object.freeze(
  Object.fromEntries(Object.entries(LANGUAGE_ALIASES).sort(([a], [b]) => a.localeCompare(b))),
);

export function remarkNormalizeCodeFenceLanguages() {
  const warned = new Set();
  const inlineWarned = new Set();

  function warnInlineDiagnostic(source, line, kind, message) {
    const dedupeKey = `${source}:${line}:${kind}`;
    if (inlineWarned.has(dedupeKey)) {
      return;
    }

    inlineWarned.add(dedupeKey);
    console.warn(`[markdown-code] ${source}:${line} ${message}`);
  }

  return (tree, file) => {
    const source = file?.path ?? 'content';

    visit(tree, (node) => Array.isArray(node.children), (parent) => {
      for (let index = 1; index < parent.children.length; index += 1) {
        const previous = parent.children[index - 1];
        const current = parent.children[index];

        if (previous.type !== 'inlineCode' || current.type !== 'text' || !current.value) {
          continue;
        }

        const updated = current.value.replace(
          /^(\s+[A-Za-z0-9_./-]+)`(?=($|[\s.,;:!?)]))/,
          '$1',
        );

        if (updated === current.value) {
          continue;
        }

        current.value = updated;
        const line = current.position?.start?.line ?? previous.position?.start?.line ?? 1;
        warnInlineDiagnostic(
          source,
          line,
          'normalized',
          'Applied deterministic inline-code normalization for dangling trailing backtick after a closed inline span.',
        );
      }
    });

    visit(tree, 'text', (node) => {
      if (!node.value || !node.value.includes('`')) {
        return;
      }

      const lineStart = node.position?.start?.line ?? 1;
      const result = analyzeInlineCodeDelimiters(node.value, { applyFixes: true });

      node.value = result.content;

      for (const diagnostic of result.diagnostics) {
        const line = lineStart + diagnostic.lineOffset;
        warnInlineDiagnostic(source, line, diagnostic.kind, diagnostic.message);
      }
    });

    visit(tree, 'code', (node) => {
      const original = node.lang ? String(node.lang).trim() : '';
      const result = normalizeCodeLanguage(original);
      node.lang = result.language;

      if (!result.unknown) {
        return;
      }

      const key = result.unknown.toLowerCase();
      if (warned.has(key)) {
        return;
      }
      warned.add(key);
      console.warn(
        `[markdown-code] Unknown fenced language "${result.unknown}" in ${source}; falling back to "text".`,
      );
    });
  };
}
