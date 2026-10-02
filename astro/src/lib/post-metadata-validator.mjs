import { REQUIRED_POST_METADATA_FIELDS } from './post-metadata-policy.mjs';

const FRONTMATTER_RE = /^---\s*\n([\s\S]*?)\n---(?:\s*\n|$)/;

function stripWrappedQuotes(value) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

export function parseFrontmatter(markdown = '') {
  const match = FRONTMATTER_RE.exec(markdown);
  if (!match) return null;

  const frontmatter = new Map();
  const lines = match[1].split('\n');

  for (const line of lines) {
    const keyValueMatch = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!keyValueMatch) continue;
    const [, key, rawValue] = keyValueMatch;
    frontmatter.set(key, stripWrappedQuotes(rawValue));
  }

  return frontmatter;
}

export function validatePostMetadata(markdown = '') {
  const frontmatter = parseFrontmatter(markdown);
  const missingFields = [];
  const emptyFields = [];

  if (!frontmatter) {
    return {
      missingFields: [...REQUIRED_POST_METADATA_FIELDS],
      emptyFields,
    };
  }

  for (const field of REQUIRED_POST_METADATA_FIELDS) {
    if (!frontmatter.has(field)) {
      missingFields.push(field);
      continue;
    }

    const value = frontmatter.get(field);
    if (!value) {
      emptyFields.push(field);
    }
  }

  return { missingFields, emptyFields };
}

export function buildMetadataWarning(filePath, markdown = '') {
  const { missingFields, emptyFields } = validatePostMetadata(markdown);
  if (missingFields.length === 0 && emptyFields.length === 0) {
    return null;
  }

  return {
    filePath,
    missingFields,
    emptyFields,
  };
}

export function formatMetadataWarning(warning) {
  const missingText =
    warning.missingFields.length > 0
      ? warning.missingFields.join(', ')
      : 'none';
  const emptyText =
    warning.emptyFields.length > 0
      ? warning.emptyFields.join(', ')
      : 'none';

  return `[post-metadata] WARN ${warning.filePath} missing=[${missingText}] empty=[${emptyText}]`;
}
