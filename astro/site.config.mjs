export const DEFAULT_SITE_URL = 'https://www.codeholics.com';

export function resolveSiteUrl(siteUrl = process.env.SITE_URL) {
  if (!siteUrl) {
    return DEFAULT_SITE_URL;
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(siteUrl);
  } catch {
    throw new Error(`SITE_URL must be a valid absolute URL, received "${siteUrl}"`);
  }

  return parsedUrl.toString().replace(/\/$/, '');
}

export const SITE_URL = resolveSiteUrl();
