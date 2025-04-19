import P from 'path';

import { defineNitroPlugin, useRuntimeConfig } from '#imports';

import setVariables from './set-variables.js';

export default defineNitroPlugin(nitroApp =>
  nitroApp.hooks.hook('content:file:afterParse', file =>
    setVariables(
      file,
      P.join('content', file._file),
      useRuntimeConfig().nuxtContentGit,
    ),
  ),
);
