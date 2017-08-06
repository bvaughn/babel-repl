// @flow

import type { CompileConfig } from './types';

const babel = require('babel-standalone');

type Return = {
  compiled: ?string,
  compileError: ?Error,
  evalError: ?Error
};

const DEFAULT_PRETTIER_CONFIG = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  trailingComma: 'none',
  bracketSpacing: true,
  jsxBracketSameLine: false,
  parser: 'babylon'
};

export default function compile(code: string, config: CompileConfig): Return {
  let compiled = null;
  let compileError = null;
  let evalError = null;

  try {
    const presets = Object.keys(config.presets)
      .filter(key => config.presets[key].isEnabled)
      .map(key => config.presets[key].config.label);

    if (config.minify) {
      presets.push('babili');
    }

    compiled = babel.transform(code, { presets }).code;

    if (config.prettify && window.prettier !== undefined) {
      // TODO Don't re-parse; just pass Prettier the AST we already have.
      compiled = window.prettier.format(compiled, DEFAULT_PRETTIER_CONFIG);
    }

    if (config.evaluate) {
      try {
        // eslint-disable-next-line
        eval(compiled);
      } catch (error) {
        evalError = error;
      }
    }
  } catch (error) {
    compiled = null;
    compileError = error;
  }

  return {
    compiled,
    compileError,
    evalError
  };
}
