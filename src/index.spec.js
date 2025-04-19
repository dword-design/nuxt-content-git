import { endent, last, property } from '@dword-design/functions';
import tester from '@dword-design/tester';
import testerPluginTmpDir from '@dword-design/tester-plugin-tmp-dir';
import axios from 'axios';
import packageName from 'depcheck-package-name';
import { execaCommand } from 'execa';
import fs from 'fs-extra';
import nuxtDevReady from 'nuxt-dev-ready';
import outputFiles from 'output-files';
import P from 'path';
import simpleGit from 'simple-git';
import kill from 'tree-kill-promise';

export default tester(
  {
    'custom field names': async () => {
      await execaCommand('git init');
      await execaCommand('git config user.email "foo@bar.de"');
      await execaCommand('git config user.name "foo"');

      await outputFiles({
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
              ['self', { createdAtName: 'gitCreatedAt', updatedAtName: 'gitUpdatedAt' }],
            ],
          }
        `,
        'pages/index.vue': endent`
          <template>
            <div>
              <div class="created-at">{{ page.gitCreatedAt }}</div>
              <div class="updated-at">{{ page.gitUpdatedAt }}</div>
            </div>
          </template>

          <script>
          export default {
            asyncData: async context => ({
              page: await context.$content('home').fetch()
            }),
          }
          </script>
        `,
        'server/api/content.get.js': endent`
          import { defineEventHandler, queryCollection } from '#imports';

          export default defineEventHandler(event => queryCollection(event, 'content').select('gitCreatedAt', 'gitUpdatedAt').all());
        `,
      });

      await execaCommand('git add .');
      await execaCommand('git commit -m init');
      const git = simpleGit();
      const log = await git.log({ file: P.join('content', 'home.md') });
      const createdAt = new Date(log.all[0].date);
      const updatedAt = new Date(log.latest.date);
      const nuxt = execaCommand('nuxt dev');

      try {
        await nuxtDevReady();

        expect(
          axios.get('http://localhost:3000/api/content')
            |> await
            |> property('data'),
        ).toEqual([
          {
            gitCreatedAt: createdAt.toISOString(),
            gitUpdatedAt: updatedAt.toISOString(),
          },
        ]);
      } finally {
        await kill(nuxt.pid);
      }
    },
    'no git': async () => {
      await outputFiles({
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
              'self',
            ],
          }
        `,
        'server/api/content.get.js': endent`
          import { defineEventHandler, queryCollection } from '#imports';

          export default defineEventHandler(event => queryCollection(event, 'content').select('createdAt', 'updatedAt').all());
        `,
      });

      const nuxt = execaCommand('nuxt dev');

      try {
        await nuxtDevReady();

        expect(
          axios.get('http://localhost:3000/api/content')
            |> await
            |> property('data'),
        ).toEqual([{ createdAt: null, updatedAt: null }]);
      } finally {
        await kill(nuxt.pid);
      }
    },
    'override dates': async () => {
      await execaCommand('git init');
      await execaCommand('git config user.email "foo@bar.de"');
      await execaCommand('git config user.name "foo"');

      await outputFiles({
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
              'self',
            ],
          }
        `,
        'server/api/content.get.js': endent`
          import { defineEventHandler, queryCollection } from '#imports';

          export default defineEventHandler(event => queryCollection(event, 'content').select('createdAt', 'updatedAt').all());
        `,
      });

      await execaCommand('git add .');
      await execaCommand('git commit -m init');

      await fs.outputFile(
        'content/home.md',
        endent`
          ---
          createdAt: 2020-04-04
          updatedAt: 2020-06-06
          ---
        `,
      );

      await execaCommand('git add .');
      await execaCommand('git commit -m update');
      const nuxt = execaCommand('nuxt dev', { env: { NODE_ENV: '' } });

      try {
        await nuxtDevReady();

        expect(
          axios.get('http://localhost:3000/api/content')
            |> await
            |> property('data'),
        ).toEqual([
          {
            createdAt: new Date('2020-04-04').toISOString(),
            updatedAt: new Date('2020-06-06').toISOString(),
          },
        ]);
      } finally {
        await kill(nuxt.pid);
      }
    },
    works: async () => {
      await execaCommand('git init');
      await execaCommand('git config user.email "foo@bar.de"');
      await execaCommand('git config user.name "foo"');

      await outputFiles({
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
              'self',
            ],
          }
        `,
        'server/api/content.get.js': endent`
          import { defineEventHandler, queryCollection } from '#imports';

          export default defineEventHandler(event => queryCollection(event, 'content').select('createdAt', 'updatedAt').all());
        `,
      });

      await execaCommand('git add .');
      await execaCommand('git commit -m init');
      await fs.outputFile('content/home.md', 'foo');
      await execaCommand('git add .');
      await execaCommand('git commit -m update');
      const git = simpleGit();
      const log = await git.log({ file: P.join('content', 'home.md') });
      const createdAt = new Date(log.all |> last |> property('date'));
      const updatedAt = new Date(log.latest.date);
      const nuxt = execaCommand('nuxt dev', { env: { NODE_ENV: '' } });

      try {
        await nuxtDevReady();

        expect(
          axios.get('http://localhost:3000/api/content')
            |> await
            |> property('data'),
        ).toEqual([
          {
            createdAt: createdAt.toISOString(),
            updatedAt: updatedAt.toISOString(),
          },
        ]);
      } finally {
        await kill(nuxt.pid);
      }
    },
  },
  [
    testerPluginTmpDir(),
    {
      beforeEach: async () => {
        await fs.outputFile(
          'node_modules/self/package.json',
          JSON.stringify({ exports: './src/index.js', name: 'self' }),
        );

        await fs.copy('../src', 'node_modules/self/src');
      },
    },
  ],
);
