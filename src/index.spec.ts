import pathLib from 'node:path';

import { expect, test } from '@playwright/test';
import axios from 'axios';
import packageName from 'depcheck-package-name';
import endent from 'endent';
import { execaCommand } from 'execa';
import fs from 'fs-extra';
import getPort from 'get-port';
import { last } from 'lodash-es';
import nuxtDevReady from 'nuxt-dev-ready';
import outputFiles from 'output-files';
import simpleGit from 'simple-git';
import kill from 'tree-kill-promise';

test('custom field names', async ({}, testInfo) => {
  const cwd = testInfo.outputPath();
  await execaCommand('git init', { cwd });
  await execaCommand('git config user.email "foo@bar.de"', { cwd });
  await execaCommand('git config user.name "foo"', { cwd });

  await outputFiles(cwd, {
    'content.config.js': endent`
      import { defineContentConfig, defineCollection, z } from '@nuxt/content';

      export default defineContentConfig({
        collections: {
          content: defineCollection({
            source: '**',
            type: 'page',
            schema: z.object({
              gitCreatedAt: z.date(),
              gitUpdatedAt: z.date(),
            }),
          }),
        },
      });
    `,
    'content/home.md': '',
    'nuxt.config.js': endent`
      export default {
        modules: [
          '${packageName`@nuxt/content`}',
          ['../../src', { createdAtName: 'gitCreatedAt', updatedAtName: 'gitUpdatedAt' }],
        ],
      }
    `,
    'server/api/content.get.js':
      "export default defineEventHandler(event => queryCollection(event, 'content').select('gitCreatedAt', 'gitUpdatedAt').all());",
  });

  await execaCommand('git add .', { cwd });
  await execaCommand('git commit -m init', { cwd });
  const git = simpleGit({ baseDir: cwd });
  const log = await git.log({ file: pathLib.join('content', 'home.md') });
  const createdAt = new Date(log.all[0].date);
  const updatedAt = new Date(log.latest.date);
  const port = await getPort();

  const nuxt = execaCommand('nuxt dev', {
    cwd,
    env: { PORT: port },
    reject: false,
    stdio: 'inherit',
  });

  try {
    await nuxtDevReady(port);
    const { data } = await axios.get(`http://localhost:${port}/api/content`);

    expect(data).toEqual([
      {
        gitCreatedAt: createdAt.toISOString(),
        gitUpdatedAt: updatedAt.toISOString(),
      },
    ]);
  } finally {
    await kill(nuxt.pid);
  }
});

test('no git', async ({}, testInfo) => {
  const cwd = testInfo.outputPath();

  await outputFiles(cwd, {
    'content.config.js': endent`
      import { defineContentConfig, defineCollection, z } from '@nuxt/content';

      export default defineContentConfig({
        collections: {
          content: defineCollection({
            source: '**',
            type: 'page',
            schema: z.object({
              createdAt: z.date(),
              updatedAt: z.date(),
            }),
          }),
        },
      });
    `,
    'content/home.md': '',
    'nuxt.config.js': endent`
      export default {
        modules: [
          '${packageName`@nuxt/content`}',
          '../../src',
        ],
      }
    `,
    'server/api/content.get.js':
      "export default defineEventHandler(event => queryCollection(event, 'content').select('createdAt', 'updatedAt').all());",
  });

  const port = await getPort();

  const nuxt = execaCommand('nuxt dev', {
    cwd,
    env: { PORT: port },
    reject: false,
  });

  try {
    await nuxtDevReady(port);
    const { data } = await axios.get(`http://localhost:${port}/api/content`);
    expect(data).toEqual([{ createdAt: null, updatedAt: null }]);
  } finally {
    await kill(nuxt.pid);
  }
});

test('override dates', async ({}, testInfo) => {
  const cwd = testInfo.outputPath();
  await execaCommand('git init', { cwd });
  await execaCommand('git config user.email "foo@bar.de"', { cwd });
  await execaCommand('git config user.name "foo"', { cwd });

  await outputFiles(cwd, {
    'content.config.js': endent`
      import { defineContentConfig, defineCollection, z } from '@nuxt/content';

      export default defineContentConfig({
        collections: {
          content: defineCollection({
            source: '**',
            type: 'page',
            schema: z.object({
              createdAt: z.date(),
              updatedAt: z.date(),
            }),
          }),
        },
      });
    `,
    'content/home.md': '',
    'nuxt.config.js': endent`
      export default {
        modules: [
          '${packageName`@nuxt/content`}',
          '../../src',
        ],
      }
    `,
    'server/api/content.get.js':
      "export default defineEventHandler(event => queryCollection(event, 'content').select('createdAt', 'updatedAt').all());",
  });

  await execaCommand('git add .', { cwd });
  await execaCommand('git commit -m init', { cwd });

  await fs.outputFile(
    pathLib.join(cwd, 'content', 'home.md'),
    endent`
      ---
      createdAt: 2020-04-04
      updatedAt: 2020-06-06
      ---
    `,
  );

  await execaCommand('git add .', { cwd });
  await execaCommand('git commit -m update', { cwd });
  const port = await getPort();

  const nuxt = execaCommand('nuxt dev', {
    cwd,
    env: { PORT: port },
    reject: false,
  });

  try {
    await nuxtDevReady(port);
    const { data } = await axios.get(`http://localhost:${port}/api/content`);

    expect(data).toEqual([
      {
        createdAt: new Date('2020-04-04').toISOString(),
        updatedAt: new Date('2020-06-06').toISOString(),
      },
    ]);
  } finally {
    await kill(nuxt.pid);
  }
});

test('schema not defined', async ({}, testInfo) => {
  const cwd = testInfo.outputPath();

  await outputFiles(cwd, {
    'content.config.js': endent`
      import { defineContentConfig, defineCollection } from '@nuxt/content';

      export default defineContentConfig({
        collections: {
          content: defineCollection({
            source: '**',
            type: 'page',
          }),
        },
      });
    `,
    'content/home.md': '',
    'nuxt.config.js': endent`
      export default {
        modules: [
          '${packageName`@nuxt/content`}',
          '../../src',
        ],
      }
    `,
    'server/api/content.get.js':
      "export default defineEventHandler(event => queryCollection(event, 'content').all());",
  });

  const port = await getPort();

  const nuxt = execaCommand('nuxt dev', {
    cwd,
    env: { PORT: port },
    reject: false,
  });

  try {
    await nuxtDevReady(port);
    await axios.get(`http://localhost:${port}/api/content`);
  } finally {
    await kill(nuxt.pid);
  }
});

test('works', async ({}, testInfo) => {
  const cwd = testInfo.outputPath();
  await execaCommand('git init', { cwd });
  await execaCommand('git config user.email "foo@bar.de"', { cwd });
  await execaCommand('git config user.name "foo"', { cwd });

  await outputFiles(cwd, {
    'content.config.js': endent`
      import { defineContentConfig, defineCollection, z } from '@nuxt/content';

      export default defineContentConfig({
        collections: {
          content: defineCollection({
            source: '**',
            type: 'page',
            schema: z.object({
              createdAt: z.date(),
              updatedAt: z.date(),
            }),
          }),
        },
      });
    `,
    'content/home.md': '',
    'nuxt.config.js': endent`
      export default {
        modules: [
          '${packageName`@nuxt/content`}',
          '../../src',
        ],
      }
    `,
    'server/api/content.get.js':
      "export default defineEventHandler(event => queryCollection(event, 'content').select('createdAt', 'updatedAt').all());",
  });

  await execaCommand('git add .', { cwd });
  await execaCommand('git commit -m init', { cwd });
  await fs.outputFile(pathLib.join(cwd, 'content', 'home.md'), 'foo');
  await execaCommand('git add .', { cwd });
  await execaCommand('git commit -m update', { cwd });
  const git = simpleGit({ baseDir: cwd });
  const log = await git.log({ file: pathLib.join('content', 'home.md') });
  const createdAt = new Date(last(log.all).date);
  const updatedAt = new Date(log.latest.date);
  const port = await getPort();

  const nuxt = execaCommand('nuxt dev', {
    cwd,
    env: { PORT: port },
    reject: false,
  });

  try {
    await nuxtDevReady(port);
    const { data } = await axios.get(`http://localhost:${port}/api/content`);

    expect(data).toEqual([
      {
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
      },
    ]);
  } finally {
    await kill(nuxt.pid);
  }
});
