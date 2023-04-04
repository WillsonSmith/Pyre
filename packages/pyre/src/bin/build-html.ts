import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { dirname } from 'node:path';
import { glob } from 'glob';

const __dirname = dirname(fileURLToPath(import.meta.url));

import { renderLit } from './render-lit.js';

import { writeFile } from 'node:fs/promises';

export const build = async (devDir: string) => {
  const files = await glob(`${devDir}/**/*.pyre.js`);
  for (const file of files) {
    const { html, ...rest } = await renderLit(file);
    if (!html) throw new Error(`No HTML returned from ${file}`);
    const assembledPage = await assemblePage(html, file.replace(devDir, ''), {
      ...rest,
    });
    const destFile = file.replace('.pyre.js', '.html');
    await writeFile(destFile, assembledPage);
  }
};

import { readFile } from 'node:fs/promises';

interface PageDetails {
  lang?: string;
  title?: string;
  description?: string;
  styles?: string;
  links?: { rel: string; href: string }[];
}
async function assemblePage(markup: string, fileSourceDir: string, pageDetails: PageDetails) {
  const htmlTemplate = await readFile(
    join(__dirname, '..', '..', 'htmlTemplates', '_base.html'),
    'utf-8',
  );

  return replaceTemplateInserts(htmlTemplate, markup, {
    fileSourceDir,
    ...pageDetails,
  });
}

function replaceTemplateInserts(
  templateHTML: string,
  markup: string,
  data: PageDetails & { fileSourceDir: string },
) {
  const { lang = 'en', title, description, styles, links, fileSourceDir } = data;
  let template = templateHTML;
  template = insertLanguage(template, lang);
  template = insertTitle(template, title);
  template = insertDescription(template, description);
  template = insertMetaTags(template, []);
  template = insertLinks(template, links);
  template = insertStyles(template, styles);
  template = insertContent(template, markup);
  template = insertModule(template, fileSourceDir);
  return template;
}

function insertTitle(template: string, title?: string) {
  if (title) {
    return template.replace('<!-- PYRE:TITLE -->', title);
  }
  return template.replace('<!-- PYRE:TITLE -->', 'Pyre');
}

function insertDescription(template: string, description?: string) {
  if (description) {
    return template.replace(
      '<!-- PYRE:DESCRIPTION -->',
      `<meta name="description" content="${description}">`,
    );
  }
  return template.replace('<!-- PYRE:DESCRIPTION -->', '');
}

interface Link {
  rel: string;
  href: string;
}

interface MetaTag {
  name: string;
  content: string;
}

function insertLanguage(template: string, language?: string) {
  if (language) {
    return template.replace('<!-- PYRE:LANG -->', language);
  }
  return template.replace('<!-- PYRE:LANG -->', 'en');
}

function insertMetaTags(template: string, metaTags: MetaTag[] = []) {
  return template.replace(
    '<!-- PYRE:META -->',
    metaTags
      .map((metaTag) => {
        return `<meta name="${metaTag.name}" content="${metaTag.content}">`;
      })
      .join('\n'),
  );
}

function insertLinks(template: string, links: Link[] = []) {
  return template.replace(
    '<!-- PYRE:LINKS -->',
    links
      .map((link) => {
        return `<link rel="${link.rel}" href="${link.href}">`;
      })
      .join('\n'),
  );
}

function insertStyles(template: string, styles?: string) {
  if (styles) {
    return template.replace('<!-- PYRE:STYLES -->', styles);
  }
  return template.replace('<!-- PYRE:STYLES -->', '');
}

function insertContent(template: string, content: string) {
  return template.replace('<!-- PYRE:CONTENT -->', content);
}

function insertModule(template: string, module: string) {
  return template.replace('<!-- PYRE:MODULE -->', module);
}
