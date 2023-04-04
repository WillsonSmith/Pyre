import { join } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));

type RenderedPage = {
  html?: string;
  title?: string;
  styles?: string;
  links?: { rel: string; href: string }[];
};

import { Worker } from 'node:worker_threads';
export async function renderLit(file: string) {
  const renderedPage: RenderedPage = await new Promise((resolve, reject) => {
    const worker = new Worker(join(__dirname, '..', 'renderer', 'renderThread.js'), {
      workerData: { file },
    });

    worker.on('message', (message: RenderedPage) => {
      resolve(message);
    });

    worker.on('error', (error) => {
      reject(error);
    });

    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
      resolve({});
    });
  });

  return renderedPage;
}
