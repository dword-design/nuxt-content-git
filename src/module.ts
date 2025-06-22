import { last } from 'lodash-es';
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
    if (content[options.createdAtName] && content[options.updatedAtName]) {
      return;
    }

    const git = simpleGit();
    const log = await git.log({ file: file.path });

    if (!content[options.createdAtName]) {
      content[options.createdAtName] =
        log.all.length > 0 ? new Date(last(log.all).date) : null;
    }

    if (!content[options.updatedAtName]) {
      content[options.updatedAtName] =
        log.latest === null ? null : new Date(log.latest.date);
    }
  });
};
