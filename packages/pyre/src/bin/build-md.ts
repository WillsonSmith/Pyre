import { glob } from 'glob';
// import { writeFile } from 'fs/promises';
import { renderLit } from './render-lit.js';

import { assemblePage } from './assemble-page.js';

/* eslint-disable import/extensions */
//eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore-next-line
import { outputFile } from 'fs-extra/esm';
/* eslint-enable import/extensions */

import fm from 'front-matter';
import { marked } from 'marked';

import { readFile } from 'fs/promises';

import { dirname, join } from 'path';

export interface FrontMatter {
  permalink: string;
  template: string;
  title: string;
  description?: string;
  date?: string;
  tags?: string[];
  [key: string]: unknown;
}

export const build = async (srcDir: string, destDir: string) => {
  console.log('Building markdown files...');

  const files = await glob(`${srcDir}/**/*.md`);
  for (const file of files) {
    const fileContents = await readFile(file, {
      encoding: 'utf-8',
    });

    const {
      attributes: frontmatter,
      body,
    }: {
      attributes: FrontMatter;
      body: string;
    } = fm(fileContents);

    if (!frontmatter.permalink) throw new Error(`No permalink found in ${file}`);
    if (!frontmatter.template) throw new Error(`No template found in ${file}`);

    const content = marked.parse(body);

    const template = join(dirname(file).replace(srcDir, destDir), frontmatter.template);

    const { html, ...rest } = await renderLit(template, frontmatter);
    if (!html) throw new Error(`No HTML returned from ${file}`);

    const assembledPage = await assemblePage(html, template.replace(destDir, ''), {
      pageDetails: { ...rest },
      markdown: content,
    });
    assembledPage;

    const fileToWrite = join(destDir, `${frontmatter.permalink}/index.html`);
    // console.log(fileToWrite);
    await outputFile(fileToWrite, assembledPage);
    // await writeFile(destFile, assembledPage);
  }
};
