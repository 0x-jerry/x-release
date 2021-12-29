import { ReleaseTaskRunner } from './commands/_types'

export enum InternalReleaseTask {
  publishToNpm = 'internal:publishToNpm',
  syncToGit = 'internal:syncToGit',
}

export function isInternalTask(task: string): task is InternalReleaseTask {
  return !!Object.keys(InternalReleaseTask).includes(task)
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
}
