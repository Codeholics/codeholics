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
  });
}

async function readRss() {
  return readFile(rssPath, 'utf8');
}

const defaultBuild = await runCommand(['run', 'build']);
assert.equal(defaultBuild.code, 0, defaultBuild.stdout || defaultBuild.stderr);

const defaultRss = await readRss();
assert.match(defaultRss, /https:\/\/www\.codeholics\.com\/posts\//);

const overrideBuild = await runCommand(['run', 'build'], {
  SITE_URL: 'https://dev.codeholics.com',
});
assert.equal(overrideBuild.code, 0, overrideBuild.stdout || overrideBuild.stderr);

const overrideRss = await readRss();
assert.match(overrideRss, /https:\/\/dev\.codeholics\.com\/posts\//);

const invalidBuild = await runCommand(['run', 'build'], {
  SITE_URL: 'not-a-url',
});
assert.notEqual(invalidBuild.code, 0);
assert.match(
  `${invalidBuild.stdout}\n${invalidBuild.stderr}`,
  /SITE_URL must be a valid absolute URL/
);
