import P from 'path'
import simpleGit from 'simple-git'

export default {
  'content:file:beforeInsert': async (file, database) => {
    const git = simpleGit()
    const log = await git.log({
      file: P.join(database.dir, `${file.path}${file.extension}`),
    })
    file.gitCreatedAt =
      log.all.length > 0 ? new Date(log.all[0].date) : file.createdAt
    file.gitUpdatedAt =
      log.latest === null ? file.updatedAt : new Date(log.latest.date)
  },
}
