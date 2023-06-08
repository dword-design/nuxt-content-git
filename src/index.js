import {
  addServerPlugin,
  createResolver,
  isNuxt3 as isNuxt3Try,
} from '@nuxt/kit'
import P from 'path'

import setVariables from './set-variables.js'

const resolver = createResolver(import.meta.url)

export default function (options, nuxt) {
  let isNuxt3 = true
  try {
    isNuxt3 = isNuxt3Try()
  } catch {
    isNuxt3 = false
  }
  nuxt = nuxt || this
  options = {
    createdAtName: 'createdAt',
    updatedAtName: 'updatedAt',
    ...(isNuxt3 && nuxt.options.runtimeConfig.nuxtContentGit),
    ...nuxt.options.nuxtContentGit,
    ...options,
  }
  if (isNuxt3) {
    nuxt.options.runtimeConfig.nuxtContentGit = options
    addServerPlugin(resolver.resolve('./server-plugin.js'))
  } else {
    this.nuxt.hook('content:file:beforeInsert', (file, database) =>
      setVariables(
        file,
        P.join(database.dir, `${file.path}${file.extension}`),
        options,
      ),
    )
  }
}
