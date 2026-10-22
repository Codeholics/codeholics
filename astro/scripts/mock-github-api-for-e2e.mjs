const originalFetch = globalThis.fetch;

globalThis.fetch = async (input, init) => {
  let url;

  try {
    url = new URL(input instanceof Request ? input.url : input.toString());
  } catch {
    return originalFetch(input, init);
  }

  const repositoryMatch = url.pathname.match(/^\/repos\/Codeholics\/([^/]+)$/);
  if (url.origin !== 'https://api.github.com' || !repositoryMatch) {
    return originalFetch(input, init);
  }

  const repository = `Codeholics/${repositoryMatch[1]}`;
  return new Response(JSON.stringify({
    full_name: repository,
    html_url: `https://github.com/${repository}`,
    description: `Test description for ${repository}`,
    stargazers_count: 12,
    forks_count: 3,
    language: 'TypeScript',
  }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};
