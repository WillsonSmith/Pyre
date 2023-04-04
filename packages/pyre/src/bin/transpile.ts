import { build as esbuild } from 'esbuild';
import { glob } from 'glob';

export async function transpile(srcDir: string, destDir: string) {
  const files = await glob(`${srcDir}/**/*.ts`);
  await esbuild({
    format: 'esm',
    entryPoints: files,
    outdir: destDir,
    bundle: false,
    sourcemap: true,
    minify: false,
    allowOverwrite: true,
  });
}
