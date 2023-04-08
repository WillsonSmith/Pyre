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
    const { input, output } = await loadConfig(options);

    choki.watch(`${input}/**/*.ts`).on('change', async () => {
      try {
        await transpile(input, output);
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
    const { input, output } = await loadConfig(options);

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
  });

program.parse();

async function loadConfig(options: { input?: string; output?: string }) {
  let config = {
    input: options.input || join(cwd(), 'src'),
    output: options.output || join(cwd(), 'pyre'),
  };
  try {
    console.log(join(cwd(), 'pyre.config.js'));
    const stats = await stat(join(cwd(), 'pyre.config.js'));
    if (stats.isFile()) {
      const { default: configFn } = await import(join(cwd(), 'pyre.config.js'));
      const configFile = configFn();
      if (configFile.input) {
        config.input = join(cwd(), configFile.input);
      }
      if (configFile.output?.dir) {
        config.output = join(cwd(), configFile.output.dir);
      }
      if (configFile.watch?.input) {
        config.input = join(cwd(), configFile.watch.input);
      }
      if (configFile.watch?.output) {
        config.output = join(cwd(), configFile.watch.output.dir);
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
