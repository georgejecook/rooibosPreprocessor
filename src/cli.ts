#!/usr/bin/env node
import { inspect } from 'util';

import { createProcessorConfig, ProcessorConfig } from './lib/ProcessorConfig';
import { RooibosProcessor } from './lib/RooibosProcessor';
const program = require('commander');
const pkg = require('../package.json');
const path = require('path');

program
  .version(pkg.version)
  .description('Rooibos Preprocessor');

program
.option('-c, --config [path]', 'Specify a config file to use.')
.option('-p, --projectPath [path]', 'Path to test spec directory.')
.option('-t, --testsFilePattern []', 'Array of globs corresponding to test files to include. Relative to projectPath')
.option('-v, --isRecordingCodeCoverage []', 'Indicates that we want to generate code coverage')
.option('-s, --sourceFilePattern []', 'Array of globs corresponding to files to include in code coverage. Relative to projectPath')
.option('-o, --outputPath [path]', 'Path to package output directory. This is where generated files, required for execution will be copied to. Relative to projectPath, defaults to source')
.description(`
  processes a brightscript SceneGraph project and creates json data structures
  which can be used by the rooibos unit testing framework, or vsCode IDE
  HAPPY TESTING :)
`)
.action((options) => {
  console.log(`Processing....`);
  console.time('Finished in:');
  let config: ProcessorConfig;
  let configJson = {};

  if (options.config) {
    try {
      configJson = require(path.resolve(process.cwd(), options.config));
    } catch (e) {
      console.log(e.message);
      process.exit(1);
    }
  } else if (options.testPath) {
    configJson = {
      projectPath: options.projectPath,
      testsFilePattern: options.testsFilePattern,
      isRecordingCodeCoverage: options.isRecordingCodeCoverage,
      sourceFilePattern: options.sourceFilePattern,
      outputPath: options.outputPath,
    };
  }

  let processor = new RooibosProcessor(createProcessorConfig(configJson));
  processor.processFiles();

  console.timeEnd('Finished in:');
});

program.parse(process.argv);
