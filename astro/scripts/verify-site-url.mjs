import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

const cwd = path.resolve(import.meta.dirname, '..');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const rssPath = path.join(cwd, 'dist', 'rss.xml');

function runCommand(args, env = {}) {
  return new Promise((resolve) => {
    const child = spawn(npmCommand, args, {
      cwd,
      env: { ...process.env, ...env },
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: process.platform === 'win32',
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('close', (code) => {
      resolve({ code, stdout, stderr });
    });
    child.on('error', (error) => {
      resolve({ code: -1, stdout, stderr: `${stderr}\n${error.message}` });
    });
  });
}

async function readRss() {
  return readFile(rssPath, 'utf8');
}

async function verifySocialUrls(origin) {
  const pages = [
    { file: ['index.html'], route: '/', image: '/assets/og-default.png' },
    {
      file: ['posts', 'the-death-of-the-self-taught-hacker', 'index.html'],
      route: '/posts/the-death-of-the-self-taught-hacker/',
      image: '/images/Posts/the-death-of-the-self-taught-hacker/The-Hacker-and-the-Server-Fortress.webp',
    },
  ];

  for (const { file, route, image } of pages) {
    const html = await readFile(path.join(cwd, 'dist', ...file), 'utf8');
    const head = html.slice(0, html.indexOf('</head>'));
    for (const tag of [
      `<link rel="canonical" href="${origin}${route}"`,
      `<meta property="og:url" content="${origin}${route}"`,
      `<meta property="og:image" content="${origin}${image}"`,
      `<meta name="twitter:image" content="${origin}${image}"`,
    ]) {
      assert.equal(head.split(tag).length - 1, 1, `Expected exactly one ${tag}`);
    }
  }
}

const defaultBuild = await runCommand(['run', 'build'], { SITE_URL: '' });
assert.equal(defaultBuild.code, 0, defaultBuild.stdout || defaultBuild.stderr);

const defaultRss = await readRss();
assert.match(defaultRss, /https:\/\/www\.codeholics\.com\/posts\//);
await verifySocialUrls('https://www.codeholics.com');

const overrideBuild = await runCommand(['run', 'build'], {
  SITE_URL: 'https://dev.codeholics.com',
});
assert.equal(overrideBuild.code, 0, overrideBuild.stdout || overrideBuild.stderr);

const overrideRss = await readRss();
assert.match(overrideRss, /https:\/\/dev\.codeholics\.com\/posts\//);
await verifySocialUrls('https://dev.codeholics.com');

const invalidBuild = await runCommand(['run', 'build'], {
  SITE_URL: 'not-a-url',
});
assert.notEqual(invalidBuild.code, 0);
assert.match(
  `${invalidBuild.stdout}\n${invalidBuild.stderr}`,
  /SITE_URL must be a valid absolute URL/
);
console.log('Default, overridden, and invalid site URL checks passed (RSS and social metadata).');
