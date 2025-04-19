import { last } from '@dword-design/functions';
import simpleGit from 'simple-git';

export default (options, nuxt) => {
  options = {
    createdAtName: 'createdAt',
    updatedAtName: 'updatedAt',
    ...nuxt.options.runtimeConfig.nuxtContentGit,
    ...nuxt.options.nuxtContentGit,
    ...options,
  };

  nuxt.options.runtimeConfig.nuxtContentGit = options;

  nuxt.hook('content:file:afterParse', async ({ file, content }) => {
    const git = simpleGit();
    const log = await git.log({ file: file.path });

    content[options.createdAtName] =
      log.all.length > 0 ? new Date(last(log.all).date).toISOString() : null;

    content[options.updatedAtName] =
      log.latest === null ? null : new Date(log.latest.date).toISOString();
  });
};
