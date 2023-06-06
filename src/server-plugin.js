import { last } from '@dword-design/functions'
import P from 'path'
import simpleGit from 'simple-git'

import { defineNitroPlugin, useRuntimeConfig } from '#imports'

export default defineNitroPlugin(nitroApp => {
  const options = useRuntimeConfig().public.nuxtContentGit
  nitroApp.hooks.hook('content:file:afterParse', async file => {
    const git = simpleGit()

    const log = await git.log({
      file: P.join('content', file._file),
    })
    file[options.createdAtName] =
      log.all.length > 0 ? new Date(last(log.all).date) : undefined
    file[options.updatedAtName] =
      log.latest === null ? undefined : new Date(log.latest.date)
  })
})
