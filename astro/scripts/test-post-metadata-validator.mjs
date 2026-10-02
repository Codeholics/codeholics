import assert from 'node:assert/strict';
import {
  buildMetadataWarning,
  formatMetadataWarning,
  validatePostMetadata,
} from '../src/lib/post-metadata-validator.mjs';
import { REQUIRED_POST_METADATA_FIELDS } from '../src/lib/post-metadata-policy.mjs';

const completePost = `---
title: "Complete Post"
date: "2026-10-01 10:00"
category: "Coding"
tags: "astro, coding"
slug: "complete-post"
summary: "A complete post"
---
Body`;

const missingFieldsPost = `---
title: "Missing Fields"
date: "2026-10-01 10:00"
category: "Coding"
---
Body`;

const emptyFieldsPost = `---
title: "Empty Fields"
date: "2026-10-01 10:00"
category: ""
tags: ''
slug: "empty-fields"
summary:
---
Body`;

const completeResult = validatePostMetadata(completePost);
assert.deepEqual(completeResult, { missingFields: [], emptyFields: [] });

const missingResult = validatePostMetadata(missingFieldsPost);
assert.deepEqual(missingResult.missingFields, ['tags', 'slug', 'summary']);
assert.deepEqual(missingResult.emptyFields, []);

const emptyResult = validatePostMetadata(emptyFieldsPost);
assert.deepEqual(emptyResult.missingFields, []);
assert.deepEqual(emptyResult.emptyFields, ['category', 'tags', 'summary']);

const noFrontmatterWarning = buildMetadataWarning('fixture-no-frontmatter.md', 'Body only');
assert(noFrontmatterWarning);
assert.deepEqual(noFrontmatterWarning.missingFields, [...REQUIRED_POST_METADATA_FIELDS]);
assert.deepEqual(noFrontmatterWarning.emptyFields, []);

const warning = buildMetadataWarning('fixture.md', missingFieldsPost);
assert(warning);
assert.equal(warning.filePath, 'fixture.md');
assert.deepEqual(warning.missingFields, ['tags', 'slug', 'summary']);
assert.deepEqual(warning.emptyFields, []);
assert.match(
  formatMetadataWarning(warning),
  /\[post-metadata\] WARN fixture\.md missing=\[tags, slug, summary\] empty=\[none\]/,
);

console.log('post-metadata validator tests passed');
