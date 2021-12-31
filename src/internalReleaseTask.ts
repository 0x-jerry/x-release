import { ReleaseTaskRunner } from './commands/_types'
import fs from 'fs/promises'
import path from 'path'
import { readPackage } from './package'
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

    const commitTpl = ctx.options.commit || conf.commit || 'chore: release v${version}'

    const commit = renderString(commitTpl, { version: ctx.nextVersion })

    await ctx.run(`git commit -m ${JSON.stringify(commit)}`)
  },
  async [InternalReleaseTask.tag](ctx) {
    const conf = await getConf()

    const tagTpl = ctx.options.tag || conf.tag || 'v${version}'

    const tag = renderString(tagTpl, { version: ctx.nextVersion })

    await ctx.run(`git tag ${JSON.stringify(tag)}`)
  },
  async [InternalReleaseTask.push](ctx) {
    await ctx.run(`git push && git push --tags`)
  },
  async [InternalReleaseTask.updatePkg](ctx) {
    const pkg = await readPackage()
    pkg.version = ctx.nextVersion

    const cwd = process.cwd()
    const pkgFile = path.join(cwd, 'package.json')

    await fs.writeFile(pkgFile, JSON.stringify(pkg, null, 2))
  },
}
