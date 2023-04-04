import { workerData, parentPort } from 'node:worker_threads';

import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';

try {
  const { file, frontmatter = {} } = workerData;
  const module = await import(file);
  const { default: renderPage, initialData = {}, styles, ...rest } = module;
  const renderedTemplate = render(await renderPage({ ...initialData, ...frontmatter }));
  const html = await collectResult(renderedTemplate);
  parentPort?.postMessage({
    html,
    styles: styles?.cssText,
    ...frontmatter,
    ...rest,
  });
} catch (error) {
  console.error(error);
}
