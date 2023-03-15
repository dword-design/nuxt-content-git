import { endent, last, property } from '@dword-design/functions'
import tester from '@dword-design/tester'
import testerPluginPuppeteer from '@dword-design/tester-plugin-puppeteer'
import packageName from 'depcheck-package-name'
import { execaCommand } from 'execa'
import fs from 'fs-extra'
import { Builder, Nuxt } from 'nuxt'
import outputFiles from 'output-files'
import P from 'path'
import simpleGit from 'simple-git'
import withLocalTmpDir from 'with-local-tmp-dir'

import self from './index.js'

export default tester(
  {
    'custom field names'() {
      return withLocalTmpDir(async () => {
        await execaCommand('git init')
        await execaCommand('git config user.email "foo@bar.de"')
        await execaCommand('git config user.name "foo"')
        await outputFiles({
          'content/home.md': '',
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
        })
        await execaCommand('git add .')
        await execaCommand('git commit -m init')

        const git = simpleGit()

        const log = await git.log({ file: P.join('content', 'home.md') })

        const createdAt = new Date(log.all[0].date)

        const updatedAt = new Date(log.latest.date)

        const nuxt = new Nuxt({
          createRequire: 'native',
          dev: false,
          modules: [
            [
              self,
              {
                createdAtName: 'gitCreatedAt',
                updatedAtName: 'gitUpdatedAt',
              },
            ],
            packageName`@nuxt/content`,
          ],
        })
        await new Builder(nuxt).build()
        try {
          await nuxt.listen()
          await this.page.goto('http://localhost:3000')

          const $createdAt = await this.page.waitForSelector('.created-at')
          expect(await $createdAt.evaluate(el => el.innerText)).toEqual(
            createdAt.toISOString(),
          )

          const $updatedAt = await this.page.waitForSelector('.updated-at')
          expect(await $updatedAt.evaluate(el => el.innerText)).toEqual(
            updatedAt.toISOString(),
          )
        } finally {
          nuxt.close()
        }
      })
    },
    'no git'() {
      return withLocalTmpDir(async () => {
        await outputFiles({
          'content/home.md': '',
          'pages/index.vue': endent`
            <template>
              <div>
                <div class="created-at">{{ page.createdAt }}</div>
                <div class="updated-at">{{ page.updatedAt }}</div>
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
        })

        const fileStats = await fs.stat(P.join('content', 'home.md'))

        const createdAt = fileStats.birthtime

        const updatedAt = fileStats.mtime

        const nuxt = new Nuxt({
          dev: false,
          modules: [self, packageName`@nuxt/content`],
        })
        await new Builder(nuxt).build()
        try {
          await nuxt.listen()
          await this.page.goto('http://localhost:3000')

          const $createdAt = await this.page.waitForSelector('.created-at')
          expect(await $createdAt.evaluate(el => el.innerText)).toEqual(
            createdAt.toISOString(),
          )

          const $updatedAt = await this.page.waitForSelector('.updated-at')
          expect(await $updatedAt.evaluate(el => el.innerText)).toEqual(
            updatedAt.toISOString(),
          )
        } finally {
          nuxt.close()
        }
      })
    },
    works() {
      return withLocalTmpDir(async () => {
        await execaCommand('git init')
        await execaCommand('git config user.email "foo@bar.de"')
        await execaCommand('git config user.name "foo"')
        await outputFiles({
          'content/home.md': '',
          'pages/index.vue': endent`
            <template>
              <div>
                <div class="created-at">{{ page.createdAt }}</div>
                <div class="updated-at">{{ page.updatedAt }}</div>
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
        })
        await execaCommand('git add .')
        await execaCommand('git commit -m init')
        await fs.outputFile(P.join('content', 'home.md'), 'foo')
        await execaCommand('git add .')
        await execaCommand('git commit -m update')

        const git = simpleGit()

        const log = await git.log({ file: P.join('content', 'home.md') })

        const createdAt = new Date(log.all |> last |> property('date'))

        const updatedAt = new Date(log.latest.date)

        const nuxt = new Nuxt({
          dev: false,
          modules: [self, packageName`@nuxt/content`],
        })
        await new Builder(nuxt).build()
        try {
          await nuxt.listen()
          await this.page.goto('http://localhost:3000')

          const $createdAt = await this.page.waitForSelector('.created-at')
          expect(await $createdAt.evaluate(el => el.innerText)).toEqual(
            createdAt.toISOString(),
          )

          const $updatedAt = await this.page.waitForSelector('.updated-at')
          expect(await $updatedAt.evaluate(el => el.innerText)).toEqual(
            updatedAt.toISOString(),
          )
        } finally {
          nuxt.close()
        }
      })
    },
  },
  [testerPluginPuppeteer()],
)
