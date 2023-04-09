#!/usr/bin/env node

import { Command } from 'commander';
const program = new Command();

import { transpile } from './transpile.js';
import { build as buildHtml } from './build-html.js';
import { build as buildMd } from './build-md.js';

import { join } from 'path';
import { cwd } from 'process';
import { stat } from 'fs/promises';

import choki from 'chokidar';

import { glob } from 'glob';

import { ensureSymlink, copy, remove } from 'fs-extra';

program
  .name('pyre')
  .description('Pyre is a static site generator for the modern web.')
  .version('0.0.1');

program
  .command('new <name>')
  .description('Create a new site')
  .argument('<name>', 'Name of the site')
  .option('-t, --template <template>', 'Template to use')
  .option('-d, --directory <directory>', 'Directory to create the site in')
  .option('--no-install', 'Do not install dependencies')
  .action((name) => {
    console.log(`Creating a new site called ${name}`);
  });

program
  .command('watch')
  .description('Watch the site for changes')
  .option('-i, --input <input>', 'Input directory')
  .option('-o, --output <output>', 'Output directory')
  .option('-t, --template <template>', 'Template file')
  .option('--prebundle', 'Bundle Lit and @webcomponents/template-shadowroot')
  .action(async (options) => {
    const { input, output, assetStrategy } = await loadConfig({ ...options, watch: true });

    try {
      // await emptyDir(output);
    } catch (e) {
      console.error(e);
    }
    try {
      // The following are requred by each other.
      // Turn TypeScript into JavaScript
      await transpile(input, output);
      // Run Lit SSR on the JavaScript
      await buildHtml(output, { prebundle: options.prebundle });
      // Process markdown files
      await buildMd(input, output);
    } catch (e) {
      console.error(e);
    }

    choki.watch(`${input}/**/*.ts`).on('change', async () => {
      try {
        await transpile(input, output);
      } catch (e) {
        console.error(e);
      }
    });

    choki
      .watch([`${input}/**/*`, `!${input}/**/*.ts`, `!${input}/**/*.md`])
      .on('add', async (file) => {
        try {
          if (assetStrategy === 'symlink') {
            await ensureSymlink(file, file.replace(input, output));
          }
          if (assetStrategy === 'copy') {
            await copy(file, file.replace(input, output), {
              overwrite: true,
              dereference: true,
            });
          }
        } catch (e) {
          console.error(e);
        }
      })
      .on('unlink', async (file) => {
        try {
          await remove(file.replace(input, output));
        } catch (e) {
          console.error(e);
        }
      });

    choki.watch(`${output}/**/*.pyre.js`).on('change', async (file) => {
      try {
        await buildHtml(output, { file });
      } catch (e) {
        console.error(e);
      }
    });
  });

program
  .command('build')
  .description('Build the site')
  .option('-i, --input <input>', 'Input directory')
  .option('-o, --output <output>', 'Output directory')
  .option('-t, --template <template>', 'Template file')
  .option('--prebundle', 'Bundle Lit and @webcomponents/template-shadowroot')
  .action(async (options) => {
    const { input, output, assetStrategy } = await loadConfig(options);

    try {
      // await emptyDir(output);
    } catch (e) {
      console.error(e);
    }
    try {
      // The following are requred by each other.
      // Turn TypeScript into JavaScript
      await transpile(input, output);
      // Run Lit SSR on the JavaScript
      await buildHtml(output, { prebundle: options.prebundle });
      // Process markdown files
      await buildMd(input, output);
    } catch (e) {
      console.error(e);
    }

    try {
      const files = (await glob(`${input}/**/*`)).filter(
        (file) => !file.endsWith('md') && !file.endsWith('ts'),
      );

      for (const file of files) {
        if (assetStrategy === 'symlink') {
          await ensureSymlink(file, file.replace(input, output));
        }
        if (assetStrategy === 'copy') {
          await copy(file, file.replace(input, output), {
            overwrite: true,
            dereference: true,
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  });

program.parse();

async function loadConfig(options: { input?: string; output?: string; watch?: boolean }) {
  let config = {
    input: options.input || join(cwd(), 'src'),
    output: options.output || join(cwd(), 'pyre'),
    assetStrategy: 'copy',
  };

  try {
    const stats = await stat(join(cwd(), 'pyre.config.js'));
    if (stats.isFile()) {
      const { default: configFn } = await import(join(cwd(), 'pyre.config.js'));
      const configFile = configFn();

      if (configFile.assetStrategy) {
        config.assetStrategy = configFile.assetStrategy;
      }

      if (configFile.input) {
        config.input = join(cwd(), configFile.input);
      }
      if (configFile.output?.dir) {
        config.output = join(cwd(), configFile.output.dir);
      }

      if (options.watch) {
        if (configFile.watch) {
          if (configFile.watch?.input) {
            config.input = join(cwd(), configFile.watch.input);
          }
          if (configFile.watch?.output?.dir) {
            config.output = join(cwd(), configFile.watch.output.dir);
          }

          if (configFile.watch?.assetStrategy) {
            config.assetStrategy = configFile.watch.assetStrategy;
          }
        }
        return config;
      }

      if (configFile.build) {
        if (configFile.build?.input) {
          config.input = join(cwd(), configFile.build.input);
        }
        if (configFile.build?.output) {
          config.output = join(cwd(), configFile.build.output.dir);
        }

        if (configFile.build?.assetStrategy) {
          config.assetStrategy = configFile.build.assetStrategy;
        }
      }

      console.log('Using Pyre config');
      return config;
    }
  } catch (e) {
    console.log(e);
    console.log('Pyre config not found');
  }
  return config;
}
