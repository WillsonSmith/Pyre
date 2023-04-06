import { glob } from 'glob';

import { assemblePage } from './assemble-page.js';
import { renderLit } from './render-lit.js';

import { writeFile } from 'node:fs/promises';

interface BuildOptions {
  prebundle?: boolean;
  file?: string;
}

export const build = async (devDir: string, { prebundle, file }: BuildOptions) => {
  if (file) {
    const { html, ...rest } = await renderLit(file);
    if (!html) throw new Error(`No HTML returned from ${file}`);
    const assembledPage = await assemblePage(html, file.replace(devDir, ''), {
      prebundle,
      pageDetails: { ...rest },
    });
    const destFile = file.replace('.pyre.js', '.html');
    await writeFile(destFile, assembledPage);
    return;
  }

  const files = await glob(`${devDir}/**/*.pyre.js`);
  for (const file of files) {
    const { html, ...rest } = await renderLit(file);
    if (!html) throw new Error(`No HTML returned from ${file}`);

    const assembledPage = await assemblePage(html, file.replace(devDir, ''), {
      prebundle,
      pageDetails: { ...rest },
    });
    const destFile = file.replace('.pyre.js', '.html');
    await writeFile(destFile, assembledPage);
  }
};
