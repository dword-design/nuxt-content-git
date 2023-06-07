import { addServerPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'

const resolver = createResolver(import.meta.url)

export default defineNuxtModule({
  setup: (options, nuxt) => {
    nuxt.options.runtimeConfig.public.nuxtContentGit = {
      createdAtName: 'createdAt',
      updatedAtName: 'updatedAt',
      ...nuxt.options.runtimeConfig.public.nuxtContentGit,
      ...nuxt.options.nuxtContentGit,
      ...options,
    }
    addServerPlugin(resolver.resolve('./server-plugin.js'))
  },
})
