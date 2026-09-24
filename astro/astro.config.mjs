// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import tailwindcss from '@tailwindcss/vite';
import rehypePrettyCode from 'rehype-pretty-code';
import { SITE_URL } from './site.config.mjs';
import { remarkNormalizeCodeFenceLanguages } from './src/lib/markdown-code.mjs';

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

const assetOrigin = getAssetOrigin();
const prettyCodeOptions = {
  keepBackground: false,
  defaultLang: 'text',
  theme: {
    dark: 'github-dark-default',
    light: 'github-light-default',
  },
};

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  markdown: {
    syntaxHighlight: false,
    processor: unified({
      remarkPlugins: [remarkNormalizeCodeFenceLanguages],
      rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
    }),
  },
  site: SITE_URL,
  vite: {
    plugins: [tailwindcss()],
    server: assetOrigin ? { origin: assetOrigin } : undefined,
  },
});
