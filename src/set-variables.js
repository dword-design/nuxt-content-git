import { last } from '@dword-design/functions';
import simpleGit from 'simple-git';

export default async (file, path, options) => {
  const git = simpleGit();
  const log = await git.log({ file: path });

  file[options.createdAtName] =
    log.all.length > 0 ? new Date(last(log.all).date) : file.createdAt;

  file[options.updatedAtName] =
    log.latest === null ? file.updatedAt : new Date(log.latest.date);
};
