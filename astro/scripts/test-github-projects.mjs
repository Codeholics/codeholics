import assert from 'node:assert/strict';
import {
  CURATED_REPOSITORY_CATEGORIES,
  loadCuratedRepositories,
  loadFeaturedRepositories,
  parseGitHubRepositoryUrl,
} from '../src/lib/github-projects.mjs';

const repositories = [
  'Codeholics/PAC',
  'Codeholics/codeholics',
  'Codeholics/US-Mass-Shootings',
  'Codeholics/PSLogging2',
];

function successfulResponse(repository) {
  return {
    ok: true,
    status: 200,
    async json() {
      return {
        full_name: repository,
        html_url: `https://github.com/${repository}`,
        description: `${repository} description`,
        stargazers_count: 12,
        forks_count: 3,
        language: 'TypeScript',
      };
    },
  };
}

const warnings = [];
const originalWarn = console.warn;
console.warn = (message) => warnings.push(message);

try {
  const requests = [];
  const token = 'test-token-not-for-output';
  const loaded = await loadFeaturedRepositories({
    token,
    async fetchRepository(url, options) {
      requests.push({ url, options });
      return successfulResponse(url.slice('https://api.github.com/repos/'.length));
    },
  });

  assert.deepEqual(
    loaded.map((repository) => repository.fullName),
    repositories,
    'repositories retain the configured order',
  );
  assert.equal(requests.length, repositories.length);
  assert.ok(requests.every(({ options }) =>
    options.headers.Authorization === `Bearer ${token}`));
  assert.ok(
    !JSON.stringify(loaded).includes(token),
    'repository metadata does not contain the build token',
  );

  warnings.length = 0;
  let failedRequestCount = 0;
  const withHttpFailure = await loadFeaturedRepositories({
    async fetchRepository(url) {
      failedRequestCount += 1;
      if (url.endsWith('/Codeholics/PAC')) {
        return { ok: false, status: 503 };
      }
      return successfulResponse(url.slice('https://api.github.com/repos/'.length));
    },
  });
  assert.equal(failedRequestCount, repositories.length);
  assert.deepEqual(
    withHttpFailure.map((repository) => repository.fullName),
    repositories.slice(1),
    'an unsuccessful response omits only its repository',
  );
  assert.ok(warnings.some((message) => message.includes('Codeholics/PAC')));

  warnings.length = 0;
  const withInvalidMetadata = await loadFeaturedRepositories({
    async fetchRepository(url) {
      if (url.endsWith('/Codeholics/codeholics')) {
        return { ok: true, async json() { return { full_name: 12 }; } };
      }
      return successfulResponse(url.slice('https://api.github.com/repos/'.length));
    },
  });
  assert.equal(withInvalidMetadata.length, repositories.length - 1);
  assert.ok(warnings.some((message) => message.includes('Codeholics/codeholics')));

  warnings.length = 0;
  const withUnsafeUrl = await loadFeaturedRepositories({
    async fetchRepository(url) {
      if (url.endsWith('/Codeholics/codeholics')) {
        return {
          ok: true,
          async json() {
            return {
              ...await successfulResponse('Codeholics/codeholics').json(),
              html_url: 'javascript:alert(1)',
            };
          },
        };
      }
      return successfulResponse(url.slice('https://api.github.com/repos/'.length));
    },
  });
  assert.equal(withUnsafeUrl.length, repositories.length - 1);
  assert.ok(warnings.some((message) => message.includes('Codeholics/codeholics')));

  warnings.length = 0;
  const withNetworkFailure = await loadFeaturedRepositories({
    async fetchRepository(url) {
      if (url.endsWith('/Codeholics/US-Mass-Shootings')) {
        throw new Error('network unavailable');
      }
      return successfulResponse(url.slice('https://api.github.com/repos/'.length));
    },
  });
  assert.equal(withNetworkFailure.length, repositories.length - 1);
  assert.ok(warnings.some((message) =>
    message.includes('Codeholics/US-Mass-Shootings') &&
    message.includes('network unavailable')));

  warnings.length = 0;
  const withJsonFailure = await loadFeaturedRepositories({
    async fetchRepository(url) {
      if (url.endsWith('/Codeholics/PSLogging2')) {
        return { ok: true, async json() { throw new Error('invalid JSON'); } };
      }
      return successfulResponse(url.slice('https://api.github.com/repos/'.length));
    },
  });
  assert.equal(withJsonFailure.length, repositories.length - 1);
  assert.ok(warnings.some((message) =>   message.includes('Codeholics/PSLogging2')));

  assert.deepEqual(
  parseGitHubRepositoryUrl('https://github.com/acme/tool/'),
  {
    owner: 'acme',
    name: 'tool',
    fullName: 'acme/tool',
    htmlUrl: 'https://github.com/acme/tool',
  },
  );
  assert.equal(
  parseGitHubRepositoryUrl('https://github.com/acme/tool.git')?.fullName,
  'acme/tool',
  );
  for (const url of [
  'http://github.com/acme/tool',
  'https://notgithub.com/acme/tool',
  'https://github.com/acme/tool/issues',
  'https://github.com/acme',
  'https://github.com/acme/tool?tab=readme',
  'not a URL',
  ]) {
  assert.equal(parseGitHubRepositoryUrl(url), null, `${url} is not a repository URL`);
  }

  assert.deepEqual(
  CURATED_REPOSITORY_CATEGORIES.map(({ id }) => id),
  ['ai-tools', 'docker-homelabs', 'closed-source-replacements', 'developer-tools'],
  'curated category configuration is stable and begins without unapproved recommendations',
  );

  warnings.length = 0;
  const curatedRequests = [];
  const curated = await loadCuratedRepositories({
  categories: [
    {
      id: 'ai-tools',
      label: 'AI Tools',
      repositories: [
        'https://github.com/acme/ai-tool',
        'https://github.com/acme/broken-tool',
        'https://evil.example/acme/unsafe',
      ],
    },
    {
      id: 'developer-tools',
      label: 'Developer Tools',
      repositories: ['https://github.com/other/dev-tool.git'],
    },
  ],
  async fetchRepository(url) {
    curatedRequests.push(url);
    if (url.endsWith('/acme/broken-tool')) {
      throw new Error('repository unavailable');
    }
    const repository = url.slice('https://api.github.com/repos/'.length);
    return successfulResponse(repository);
  },
  });
  assert.deepEqual(curatedRequests.sort(), [
  'https://api.github.com/repos/acme/ai-tool',
  'https://api.github.com/repos/acme/broken-tool',
  'https://api.github.com/repos/other/dev-tool',
  ]);
  assert.deepEqual(curated.map(({ id, repositories: entries }) => ({
  id,
  repositories: entries.map(({ fullName }) => fullName),
  })), [
  { id: 'ai-tools', repositories: ['acme/ai-tool'] },
  { id: 'developer-tools', repositories: ['other/dev-tool'] },
  ]);
  assert.ok(warnings.some((message) => message.includes('unsafe')));
  assert.ok(warnings.some((message) => message.includes('acme/broken-tool')));

  console.log('GitHub project metadata tests passed.');
} finally {
  console.warn = originalWarn;
}
