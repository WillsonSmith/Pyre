import { workerData, parentPort } from 'node:worker_threads';

import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';

try {
  const { file, frontmatter = {} } = workerData;
  const module = await import(file);
  const { default: renderPage, styles, links, title, description, initialData = {} } = module;
  const renderedTemplate = render(await renderPage({ ...initialData, ...frontmatter }));
  const html = await collectResult(renderedTemplate);
  parentPort?.postMessage({
    html,
    title,
    description,
    styles: styles?.cssText,
    links,
    ...frontmatter,
  });
} catch (error) {
  console.error(error);
}
