import { last } from '@dword-design/functions'
import P from 'path'
import simpleGit from 'simple-git'

import { defineNitroPlugin, useRuntimeConfig } from '#imports'

export default defineNitroPlugin(nitroApp => {
  const options = useRuntimeConfig().public.nuxtContentGit
  nitroApp.hooks.hook('content:file:afterParse', async (file, database) => {
    if (file._id.endsWith('.md')) {
      const git = simpleGit()

      const log = await git.log({
        file: P.join(database.dir, `${file.path}${file.extension}`),
      })
      file[options.createdAtName] =
        log.all.length > 0 ? new Date(last(log.all).date) : file.createdAt
      file[options.updatedAtName] =
        log.latest === null ? file.updatedAt : new Date(log.latest.date)
    }
  })
})
