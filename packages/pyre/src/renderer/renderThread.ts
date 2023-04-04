import { workerData, parentPort } from 'node:worker_threads';

import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';

try {
  const { file, frontmatter = {} } = workerData;
  const {
    default: renderPage,
    styles,
    links,
    title,
    description,
    initialData = {},
  } = await import(file);
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
