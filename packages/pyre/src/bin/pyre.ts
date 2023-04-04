#!/usr/bin/env node

import { Command } from 'commander';
const program = new Command();

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
  .action((options) => {
    console.log(options);
    console.log('build');
  });

program.parse();
