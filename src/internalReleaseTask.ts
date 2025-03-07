import fs from 'node:fs/promises'
import { runTask } from './helper'
import type { ReleaseTask } from './types'
import { clean } from './utils/clean'
import { renderString } from './utils/renderString'
import { logger } from './utils/dev'

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
        await runTask(ctx, ctx.conf.beforeCommit)
      }
    },
  },
  {
    name: 'git commit',
    async task(ctx) {
      if (ctx.currentVersion === ctx.nextVersion) return

      await ctx.run('git add .')

      const prefix = ctx.package.parent ? `${ctx.package.config.name}@` : ''

      const commit = renderString(ctx.conf.commit, {
        version: ctx.nextVersion,
        prefix,
      })

      await ctx.run(`git commit -m ${JSON.stringify(commit)}`)
    },
  },
  {
    name: 'git tag',
    async task(ctx) {
      if (ctx.currentVersion === ctx.nextVersion) return

      const prefix = ctx.package.parent ? `${ctx.package.config.name}@` : ''

      const tag = renderString(ctx.conf.tag, {
        version: ctx.nextVersion,
        prefix,
      })

      await ctx.run(`git tag ${JSON.stringify(tag)}`)
    },
  },
  {
    name: 'git push',
    async task(ctx) {
      await ctx.run('git push')
      await ctx.run('git push --tags')
    },
  },
  {
    name: 'npm publish',
    async task(ctx) {
      if (!ctx.conf.publish) {
        logger.log('publish task skipped')
        return
      }

      if (ctx.conf.clean) {
        await clean(ctx.conf.clean, ctx.cwd)
      }
      await ctx.run('npm publish')
    },
  },
]
