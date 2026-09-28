function isEscaped(line, index) {
  let backslashes = 0;

  for (let i = index - 1; i >= 0 && line[i] === '\\'; i -= 1) {
    backslashes += 1;
  }

  return backslashes % 2 === 1;
}

function countUnescapedBackticks(line) {
  let count = 0;

  for (let i = 0; i < line.length; i += 1) {
    if (line[i] === '`' && !isEscaped(line, i)) {
      count += 1;
    }
  }

  return count;
}

const TRAILING_BACKTICK_AFTER_INLINE_CODE =
  /(`[^`\n]+`)(\s+[A-Za-z0-9_./-]+)`(?=($|[\s.,;:!?)]))/g;

function applyDeterministicInlineFixes(line) {
  let fixCount = 0;
  const fixedLine = line.replace(TRAILING_BACKTICK_AFTER_INLINE_CODE, (_, codeSpan, trailingWord) => {
    fixCount += 1;
    return `${codeSpan}${trailingWord}`;
  });

  return { fixedLine, fixCount };
}

export function analyzeInlineCodeDelimiters(markdownText, { applyFixes = false } = {}) {
  const diagnostics = [];
  const lines = markdownText.split('\n');
  const output = lines.map((line, lineIndex) => {
    if (!line.includes('`')) {
      return line;
    }

    const originalCount = countUnescapedBackticks(line);
    const { fixedLine, fixCount } = applyDeterministicInlineFixes(line);
    const normalizedCount = countUnescapedBackticks(fixedLine);

    if (fixCount > 0) {
      diagnostics.push({
        kind: applyFixes ? 'normalized' : 'fixable',
        lineOffset: lineIndex,
        message:
          'Found deterministic malformed inline-code delimiter pattern (dangling trailing backtick after a closed inline span).',
      });
    }

    const hasUnresolvedOddBackticks = normalizedCount % 2 !== 0;
    if (hasUnresolvedOddBackticks) {
      diagnostics.push({
        kind: 'ambiguous',
        lineOffset: lineIndex,
        message:
          'Found unresolved unmatched inline-code delimiter; manual markdown correction is required.',
      });
    }

    if (!applyFixes) {
      return line;
    }

    if (originalCount % 2 === 0 && fixCount === 0) {
      return line;
    }

    return fixedLine;
  });

  return {
    content: output.join('\n'),
    diagnostics,
  };
}

export function formatInlineCodeDiagnostic({ filePath, line, message, kind }) {
  return `[inline-code][${kind}] ${filePath}:${line} ${message}`;
}
