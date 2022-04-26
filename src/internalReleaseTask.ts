import { ReleaseTaskRunner } from './commands/_types'
import fs from 'fs/promises'
import { getConf } from './modules/config'
import { renderString } from './utils/renderString'

export enum InternalReleaseTask {
  updatePkg = 'pkg.update.version',
  publish = 'npm.publish',
  commit = 'git.commit',
  tag = 'git.tag',
  push = 'git.push',
}

export function isInternalTask(task: string): task is InternalReleaseTask {
  const keys = Object.values(InternalReleaseTask)

  // @ts-expect-error
  return keys.includes(task)
}

export const internalTasks: Record<InternalReleaseTask, ReleaseTaskRunner> = {
  async [InternalReleaseTask.publish](ctx) {
    await ctx.runNpm('publish')
  },
  async [InternalReleaseTask.commit](ctx) {
    await ctx.run('git add .')

    const conf = await getConf()

    const prefix = ctx.package.parent ? ctx.package.config.name + '@' : ''

    const defaultCommitTpl = `chore: release ${prefix}v\${version}`

    const commitTpl = ctx.options.commit || conf.commit || defaultCommitTpl

    const commit = renderString(commitTpl, { version: ctx.nextVersion })

    await ctx.run(`git commit -m ${JSON.stringify(commit)}`)
  },
  async [InternalReleaseTask.tag](ctx) {
    const conf = await getConf()

    const prefix = ctx.package.parent ? ctx.package.config.name + '@' : ''

    const defaultTagTpl = `${prefix}v\${version}`

    const tagTpl = ctx.options.tag || conf.tag || defaultTagTpl

    const tag = renderString(tagTpl, { version: ctx.nextVersion })

    await ctx.run(`git tag ${JSON.stringify(tag)}`)
  },
  async [InternalReleaseTask.push](ctx) {
    await ctx.run(`git push && git push --tags`)
  },
  async [InternalReleaseTask.updatePkg](ctx) {
    // shallow clone
    const pkg = {
      ...ctx.package.config,
      version: ctx.nextVersion,
    }

    await fs.writeFile(ctx.package.path, JSON.stringify(pkg, null, 2))
  },
}
