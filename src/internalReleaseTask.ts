import { ReleaseTaskRunner } from './commands/_types'
import fs from 'fs/promises'
import path from 'path'
import { readPackage } from './package'

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
    await ctx.run(`yarn publish --new-version ${ctx.nextVersion}`)
  },
  async [InternalReleaseTask.commit](ctx) {
    await ctx.run('git add .')

    const commitMsg = `chore: release v${ctx.nextVersion}`

    await ctx.run(`git commit -m ${JSON.stringify(commitMsg)}`)
  },
  async [InternalReleaseTask.tag](ctx) {
    await ctx.run(`git tag v${ctx.nextVersion}`)
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
