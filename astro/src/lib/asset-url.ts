const assetOrigin = import.meta.env.DEV ? import.meta.env.ASSET_URL : undefined;

export function publicAssetUrl(path: `/${string}`): string {
  if (!assetOrigin) {
    return path;
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(assetOrigin);
  } catch {
    throw new Error(`ASSET_URL must be a valid absolute URL, received "${assetOrigin}"`);
  }

  return new URL(path, parsedUrl.toString().endsWith('/') ? parsedUrl : `${parsedUrl.toString()}/`).toString();
}
