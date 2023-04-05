#!/usr/bin/env node

import { Command } from 'commander';
const program = new Command();

import { transpile } from './transpile.js';
import { build as buildHtml } from './build-html.js';

import { join } from 'path';
import { cwd } from 'process';

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
    const input = options.input ? join(cwd(), options.input) : join(cwd(), 'src');
    const output = options.output ? join(cwd(), options.output) : join(cwd(), 'pyre');

    await transpile(input, output);

    await new Promise((resolve) => {
      console.log('Implement dependency copy for prebundle (see build-html.ts)');
      resolve(true);
    });

    await buildHtml(output, { prebundle: options.prebundle });
  });

program.parse();
