import { endent } from '@dword-design/functions'
import tester from '@dword-design/tester'
import testerPluginPuppeteer from '@dword-design/tester-plugin-puppeteer'
import packageName from 'depcheck-package-name'
import execa from 'execa'
import { stat } from 'fs-extra'
import { Builder, Nuxt } from 'nuxt'
import outputFiles from 'output-files'
import P from 'path'
import simpleGit from 'simple-git'
import withLocalTmpDir from 'with-local-tmp-dir'

import self from '.'

export default tester(
  {
    'no git': function () {
      return withLocalTmpDir(async () => {
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
        const fileStats = await stat(P.join('content', 'home.md'))
        const createdAt = fileStats.birthtime
        const updatedAt = fileStats.mtime
        const nuxt = new Nuxt({
          build: { quiet: false },
          createRequire: 'native',
          dev: false,
          hooks: self,
          modules: [packageName`@nuxt/content`],
        })
        await new Builder(nuxt).build()
        try {
          await nuxt.listen()
          await this.page.goto('http://localhost:3000')
          const $createdAt = await this.page.waitForSelector('.created-at')
          expect(await $createdAt.evaluate(el => el.innerText)).toEqual(
            createdAt.toISOString()
          )
          const $updatedAt = await this.page.waitForSelector('.updated-at')
          expect(await $updatedAt.evaluate(el => el.innerText)).toEqual(
            updatedAt.toISOString()
          )
        } finally {
          nuxt.close()
        }
      })
    },
    works() {
      return withLocalTmpDir(async () => {
        await execa.command('git init')
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
        await execa.command('git add .')
        await execa.command('git commit -m init')
        const git = simpleGit()
        const log = await git.log({ file: P.join('content', 'home.md') })
        const createdAt = new Date(log.all[0].date)
        const updatedAt = new Date(log.latest.date)
        const nuxt = new Nuxt({
          createRequire: 'native',
          dev: false,
          hooks: self,
          modules: [packageName`@nuxt/content`],
        })
        await new Builder(nuxt).build()
        try {
          await nuxt.listen()
          await this.page.goto('http://localhost:3000')
          const $createdAt = await this.page.waitForSelector('.created-at')
          expect(await $createdAt.evaluate(el => el.innerText)).toEqual(
            createdAt.toISOString()
          )
          const $updatedAt = await this.page.waitForSelector('.updated-at')
          expect(await $updatedAt.evaluate(el => el.innerText)).toEqual(
            updatedAt.toISOString()
          )
        } finally {
          nuxt.close()
        }
      })
    },
  },
  [testerPluginPuppeteer()]
)
