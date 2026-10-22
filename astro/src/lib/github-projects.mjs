const GITHUB_API_URL = 'https://api.github.com/repos';

export const FEATURED_REPOSITORIES = [
  'Codeholics/PAC',
  'Codeholics/codeholics',
  'Codeholics/US-Mass-Shootings',
  'Codeholics/PSLogging2',
];

export const CURATED_REPOSITORY_CATEGORIES = [
  { id: 'ai-tools', label: 'AI Tools', repositories: [] },
  { id: 'docker-homelabs', label: 'Docker & Homelabs', repositories: [] },
  {
    id: 'closed-source-replacements',
    label: 'Closed Source Replacements',
    repositories: [],
  },
  { id: 'developer-tools', label: 'Developer Tools', repositories: [] },
];

export function parseGitHubRepositoryUrl(value) {
  let repositoryUrl;

  try {
    repositoryUrl = new URL(value);
  } catch {
    return null;
  }

  if (
    repositoryUrl.protocol !== 'https:' ||
    repositoryUrl.hostname !== 'github.com' ||
    repositoryUrl.username ||
    repositoryUrl.password ||
    repositoryUrl.port ||
    repositoryUrl.search ||
    repositoryUrl.hash
  ) {
    return null;
  }

  const match = repositoryUrl.pathname.match(/^\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)\/?$/);
  if (!match) {
    return null;
  }

  const [, owner, repository] = match;
  const name = repository.replace(/\.git$/i, '');
  if (!owner || !name || owner === '.' || owner === '..' || name === '.' || name === '..') {
    return null;
  }

  return {
    owner,
    name,
    fullName: `${owner}/${name}`,
    htmlUrl: `https://github.com/${owner}/${name}`,
  };
}

function parseRepository(data) {
  let repositoryUrl;

  try {
    repositoryUrl = new URL(data?.html_url);
  } catch {
    return null;
  }

  if (
    !data ||
    typeof data.full_name !== 'string' ||
    data.full_name.length === 0 ||
    repositoryUrl.protocol !== 'https:' ||
    repositoryUrl.hostname !== 'github.com' ||
    repositoryUrl.username ||
    repositoryUrl.password ||
    !Number.isFinite(data.stargazers_count) ||
    data.stargazers_count < 0 ||
    !Number.isFinite(data.forks_count) ||
    data.forks_count < 0 ||
    (data.description !== null && typeof data.description !== 'string') ||
    (data.language !== null && typeof data.language !== 'string')
  ) {
    return null;
  }

  return {
    fullName: data.full_name,
    htmlUrl: data.html_url,
    description: data.description,
    stars: data.stargazers_count,
    forks: data.forks_count,
    language: data.language,
  };
}

async function loadRepositoryMetadata(repositories, { fetchRepository, token }) {
  const results = await Promise.all(
    repositories.map(async (repository) => {
      const headers = {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      try {
        const response = await fetchRepository(
          `${GITHUB_API_URL}/${repository.split('/').map(encodeURIComponent).join('/')}`,
          { headers },
        );

        if (!response.ok) {
          console.warn(
            `[github-projects] Could not load ${repository}: GitHub returned HTTP ${response.status}.`,
          );
          return null;
        }

        const data = parseRepository(await response.json());
        if (!data) {
          console.warn(
            `[github-projects] Could not load ${repository}: GitHub returned invalid repository metadata.`,
          );
          return null;
        }

        return data;
      } catch (error) {
        const reason = error instanceof Error ? error.message : 'request failed';
        console.warn(
          `[github-projects] Could not load ${repository}: ${reason}.`,
        );
        return null;
      }
    }),
  );

  return results.filter(Boolean);
}

export async function loadFeaturedRepositories(options = {}) {
  return loadRepositoryMetadata(FEATURED_REPOSITORIES, {
    fetchRepository: options.fetchRepository ?? fetch,
    token: options.token,
  });
}

export async function loadCuratedRepositories({
  categories = CURATED_REPOSITORY_CATEGORIES,
  fetchRepository = fetch,
  token,
} = {}) {
  const loadedCategories = await Promise.all(
    categories.map(async (category) => {
      const repositorySlugs = category.repositories.map((repositoryUrl) => {
        const repository = parseGitHubRepositoryUrl(repositoryUrl);
        if (!repository) {
          console.warn(
            `[github-projects] Ignoring invalid curated repository URL in ${category.label}: ${String(repositoryUrl)}.`,
          );
          return null;
        }
        return repository.fullName;
      });
      const repositories = await loadRepositoryMetadata(
        repositorySlugs.filter(Boolean),
        { fetchRepository, token },
      );
      return { ...category, repositories };
    }),
  );

  return loadedCategories;
}
