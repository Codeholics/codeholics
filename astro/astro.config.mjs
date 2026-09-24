// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { SITE_URL } from './site.config.mjs';

function getAssetOrigin() {
  const assetOrigin = process.env.ASSET_URL;

  if (!assetOrigin) {
    return undefined;
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(assetOrigin);
  } catch {
    throw new Error(`ASSET_URL must be a valid absolute URL, received "${assetOrigin}"`);
  }

  return parsedUrl.toString().replace(/\/$/, '');
}

// https://astro.build/config
export default defineConfig(({ command }) => {
  const assetOrigin = getAssetOrigin();

  return {
    site: SITE_URL,
    vite: {
      plugins: [tailwindcss()],
      server: command === 'dev' && assetOrigin ? { origin: assetOrigin } : undefined,
    },
  };
});
