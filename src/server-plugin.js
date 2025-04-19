import { last } from '@dword-design/functions';
import P from 'path';
import simpleGit from 'simple-git';

import { defineNitroPlugin, useRuntimeConfig } from '#imports';

const options = useRuntimeConfig().nuxtContentGit;

export default defineNitroPlugin(nitroApp =>
  nitroApp.hooks.hook('content:file:afterParse', async file => {
    const git = simpleGit();
    const log = await git.log({ file: P.join('content', file._file) });

    file[options.createdAtName] =
      log.all.length > 0 ? new Date(last(log.all).date) : file.createdAt;

    file[options.updatedAtName] =
      log.latest === null ? file.updatedAt : new Date(log.latest.date);
  }),
);
