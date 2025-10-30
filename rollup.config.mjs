import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import postcssImport from 'postcss-import';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = __dirname;

export default {
  input: {
    index: resolve(rootDir, 'src', 'entry', 'index.bundle.js'),
    about: resolve(rootDir, 'src', 'entry', 'about.bundle.js'),
  },
  output: {
    dir: resolve(rootDir, 'docs', 'assets', 'js'),
    format: 'es',
    sourcemap: true,
    entryFileNames: '[name].js',
  },
  plugins: [
    alias({
      entries: [
        { find: '@', replacement: resolve(rootDir, 'src') },
        { find: /^views\//, replacement: resolve(rootDir, 'src', 'views') + '/' },
        { find: /^controllers\//, replacement: resolve(rootDir, 'src', 'controllers') + '/' },
        { find: /^stores\//, replacement: resolve(rootDir, 'src', 'stores') + '/' },
        { find: /^services\//, replacement: resolve(rootDir, 'src', 'services') + '/' },
        { find: /^api\//, replacement: resolve(rootDir, 'src', 'api') + '/' },
      ],
    }),
    nodeResolve(),
    commonjs(),
    postcss({
      plugins: [postcssImport()],
      extract: 'bundle.css',
      minimize: true,
    }),
  ],
  treeshake: true,
};
