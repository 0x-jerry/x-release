import type { ReleaseTask } from './types'
import fs from 'fs/promises'
import { renderString } from './utils/renderString'
import { runTask } from './helper'

export const publishTask: ReleaseTask = {
  name: 'npm publish',
  async task(ctx) {
    await ctx.run('npm publish')
  },
}

export const defaultTasks: ReleaseTask[] = [
  {
    name: 'update package version',
    async task(ctx) {
      if (ctx.currentVersion === ctx.nextVersion) return

      // shallow clone
      const pkg = {
        ...ctx.package.config,
        version: ctx.nextVersion,
      }

      await fs.writeFile(ctx.package.path, JSON.stringify(pkg, null, 2))
    },
  },
  {
    name: 'before commit',
    async task(ctx) {
      if (ctx.conf.beforeCommit) {
        runTask(ctx, ctx.conf.beforeCommit)
      }
    },
  },
  {
    name: 'git commit',
    async task(ctx) {
      if (ctx.currentVersion === ctx.nextVersion) return

      await ctx.run('git add .')

      const prefix = ctx.package.parent ? ctx.package.config.name + '@' : ''

      const commit = renderString(ctx.conf.commit, { version: ctx.nextVersion, prefix })

      await ctx.run(`git commit -m ${JSON.stringify(commit)}`)
    },
  },
  {
    name: 'git tag',
    async task(ctx) {
      if (ctx.currentVersion === ctx.nextVersion) return

      const prefix = ctx.package.parent ? ctx.package.config.name + '@' : ''

      const tag = renderString(ctx.conf.tag, { version: ctx.nextVersion, prefix })

      await ctx.run(`git tag ${JSON.stringify(tag)}`)
    },
  },
  {
    name: 'git push',
    async task(ctx) {
      await ctx.run(`git push`)
      await ctx.run(`git push --tags`)
    },
  },
]
