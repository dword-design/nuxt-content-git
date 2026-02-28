import { defineNuxtModule } from '@nuxt/kit';
import simpleGit from 'simple-git';

export default defineNuxtModule<{
  createdAtName: string;
  updatedAtName: string;
}>({
  defaults: { createdAtName: 'createdAt', updatedAtName: 'updatedAt' },
  meta: {
    compatibility: { nuxt: '>=3.0.0' },
    configKey: 'contentGit',
    name: 'nuxt-content-git',
  },
  setup: (options, nuxt) => {
    nuxt.hook('content:file:afterParse', async ({ file, content }) => {
      if (content[options.createdAtName] && content[options.updatedAtName]) {
        return;
      }

      const git = simpleGit();
      const log = await git.log({ file: file.path });

      if (!content[options.createdAtName]) {
        const oldest = log.all.at(-1);
        content[options.createdAtName] = oldest ? new Date(oldest.date) : null;
      }

      if (!content[options.updatedAtName]) {
        content[options.updatedAtName] =
          log.latest === null ? null : new Date(log.latest.date);
      }
    });
  },
});
