import { mkdir, readFile, writeFile, cp, readdir, stat, rename } from 'node:fs/promises';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const docsDir = resolve(rootDir, 'docs');
const assetsDir = resolve(docsDir, 'assets');
const jsDir = resolve(assetsDir, 'js');
const cssDir = resolve(assetsDir, 'css');

await mkdir(jsDir, { recursive: true });
await mkdir(cssDir, { recursive: true });

// Move CSS bundle extracted by Rollup (if present)
const bundledCssInJs = resolve(jsDir, 'bundle.css');
try {
  await rename(bundledCssInJs, resolve(cssDir, 'bundle.css'));
} catch (err) {
  if (err.code !== 'ENOENT') throw err;
}

// Copy static assets (e.g. images) from public/assets to docs/assets
const publicAssetsDir = resolve(rootDir, 'public', 'assets');
try {
  await cp(publicAssetsDir, assetsDir, { recursive: true, force: true });
} catch (err) {
  if (err.code !== 'ENOENT') {
    throw err;
  }
}

// Copy component-scoped CSS next to bundled JS (lazy-loaded via import.meta.url)
async function collectCssFiles(dir) {
  const entries = await readdir(dir);
  const files = [];
  for (const entry of entries) {
    const fullPath = resolve(dir, entry);
    const entryStat = await stat(fullPath);
    if (entryStat.isDirectory()) {
      files.push(...(await collectCssFiles(fullPath)));
    } else if (fullPath.endsWith('.css')) {
      files.push(fullPath);
    }
  }
  return files;
}

const viewCssFiles = await collectCssFiles(resolve(rootDir, 'src', 'views'));
for (const file of viewCssFiles) {
  const dest = resolve(jsDir, basename(file));
  await cp(file, dest, { force: true });
}

// Transform HTML files for production output
const htmlFiles = ['index.html', 'about.html'];
const importMapRegex = /<script type="importmap">[\s\S]*?<\/script>\s*/g;

for (const file of htmlFiles) {
  const srcPath = resolve(rootDir, file);
  const destPath = resolve(docsDir, file);
  let html = await readFile(srcPath, 'utf8');

  html = html
    .replace(importMapRegex, '')
    .replace('./src/styles/global.css', './assets/css/bundle.css')
    .replace(`./src/entry/${file === 'index.html' ? 'index' : 'about'}.js`, `./assets/js/${file === 'index.html' ? 'index' : 'about'}.js`);

  await writeFile(destPath, html);
}
