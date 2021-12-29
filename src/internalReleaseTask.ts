import { ReleaseTaskRunner } from './commands/_types'
import fs from 'fs/promises'
import path from 'path'
import { readPackage } from './package'

export enum InternalReleaseTask {
  publishToNpm = 'internal:publishToNpm',
  syncToGit = 'internal:syncToGit',
  updatePackageVersion = 'internal: updatePackageVersion',
}

export function isInternalTask(task: string): task is InternalReleaseTask {
  const keys = Object.values(InternalReleaseTask)

  // @ts-expect-error
  return keys.includes(task)
}

export const internalTasks: Record<InternalReleaseTask, ReleaseTaskRunner> = {
  async [InternalReleaseTask.publishToNpm](ctx) {
    await ctx.run(`yarn publish --new-version ${ctx.nextVersion}`)
  },
  async [InternalReleaseTask.syncToGit](ctx) {
    await ctx.run('git add .')

    const commitMsg = `chore: release v${ctx.nextVersion}`

    await ctx.run(`git commit -m ${JSON.stringify(commitMsg)}`)

    await ctx.run(`git tag v${ctx.nextVersion}`)
    await ctx.run(`git push && git push --tags`)
  },
  async [InternalReleaseTask.updatePackageVersion](ctx) {
    const pkg = await readPackage()
    pkg.version = ctx.nextVersion

    const cwd = process.cwd()
    const pkgFile = path.join(cwd, 'package.json')

    await fs.writeFile(pkgFile, JSON.stringify(pkg, null, 2))
  },
}
