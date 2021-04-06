import { last, property } from '@dword-design/functions'
import P from 'path'
import simpleGit from 'simple-git'

export default function (options) {
  options = {
    createdAtName: 'createdAt',
    updatedAtName: 'updatedAt',
    ...this.options.nuxtContentGit,
    ...options,
  }
  this.nuxt.hook('content:file:beforeInsert', async (file, database) => {
    const git = simpleGit()

    const log = await git.log({
      file: P.join(database.dir, `${file.path}${file.extension}`),
    })
    file[options.createdAtName] =
      log.all.length > 0
        ? new Date(log.all |> last |> property('date'))
        : file.createdAt
    file[options.updatedAtName] =
      log.latest === null ? file.updatedAt : new Date(log.latest.date)
  })
}
