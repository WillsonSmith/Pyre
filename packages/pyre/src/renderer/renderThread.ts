import { workerData, parentPort } from 'node:worker_threads';

import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';

try {
  const { file, additionalData = {} } = workerData;
  const module = await import(file);
  const { update: _, default: renderPage, initialData = {}, styles, ...rest } = module;
  const renderedTemplate = render(await renderPage({ ...initialData, ...additionalData }));
  const html = await collectResult(renderedTemplate);
  parentPort?.postMessage({
    html,
    styles: styles?.cssText,
    ...additionalData,
    ...rest,
  });
} catch (error) {
  console.error(error);
}
