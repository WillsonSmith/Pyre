import { build as esbuild } from 'esbuild';
import { glob } from 'glob';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const bundles = await glob(join(__dirname, '..', 'src/bundles/**/*.ts'));

await esbuild({
  entryPoints: bundles,
  bundle: true,
  splitting: true,
  format: 'esm',
  outdir: join(__dirname, '..', 'dist/bundles'),
  platform: 'browser',
  target: 'es2020',
  minify: true,
  sourcemap: true,
});
