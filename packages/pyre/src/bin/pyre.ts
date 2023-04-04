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
  .command('build')
  .description('Build the site')
  .option('-i, --input <input>', 'Input directory')
  .option('-o, --output <output>', 'Output directory')
  .option('-t, --template <template>', 'Template file')
  .action(async (options) => {
    const input = options.input ? join(cwd(), options.input) : join(cwd(), 'src');
    const output = options.output ? join(cwd(), options.output) : join(cwd(), 'pyre');

    await transpile(input, output);
    await buildHtml(output);
  });

program.parse();
