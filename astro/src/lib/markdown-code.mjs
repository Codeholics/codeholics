import { visit } from 'unist-util-visit';

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

  return (tree, file) => {
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
      const source = file?.path ?? 'content';
      console.warn(
        `[markdown-code] Unknown fenced language "${result.unknown}" in ${source}; falling back to "text".`,
      );
    });
  };
}
