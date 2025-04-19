import { addServerPlugin, createResolver } from '@nuxt/kit';

const resolver = createResolver(import.meta.url);

export default (options, nuxt) => {
  options = {
    createdAtName: 'createdAt',
    updatedAtName: 'updatedAt',
    ...nuxt.options.runtimeConfig.nuxtContentGit,
    ...nuxt.options.nuxtContentGit,
    ...options,
  };

  nuxt.options.runtimeConfig.nuxtContentGit = options;
  addServerPlugin(resolver.resolve('./server-plugin.js'));
};
