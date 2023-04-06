#!/usr/bin/env node

import { Command } from 'commander';
const program = new Command();

import { transpile } from './transpile.js';
import { build as buildHtml } from './build-html.js';
import { build as buildMd } from './build-md.js';

import { join } from 'path';
import { cwd } from 'process';
import { stat } from 'fs/promises';

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
  .command('build')
  .description('Build the site')
  .option('-i, --input <input>', 'Input directory')
  .option('-o, --output <output>', 'Output directory')
  .option('-t, --template <template>', 'Template file')
  .option('--prebundle', 'Bundle Lit and @webcomponents/template-shadowroot')
  .action(async (options) => {
    let input = options.input ? join(cwd(), options.input) : join(cwd(), 'src');
    let output = options.output ? join(cwd(), options.output) : join(cwd(), 'pyre');

    try {
      const stats = await stat(join(cwd(), 'pyre.config.js'));
      if (stats.isFile()) {
        console.log('Using pyre.config.js');
        const { default: configFn } = await import(join(cwd(), 'pyre.config.js'));

        const config = configFn();
        input = config.input ? join(cwd(), config.input) : input;
        output = config?.output?.dir ? join(cwd(), config.output.dir) : output;
      }
    } catch (e) {
      console.log('No pyre.config.js found');
    }

    await transpile(input, output);

    await new Promise((resolve) => {
      resolve(true);
    });

    await buildHtml(output, { prebundle: options.prebundle });
    await buildMd(input, output);
  });

program.parse();
