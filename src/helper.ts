import type { ReleaseContext, ReleaseTask } from './types'

export async function runTasks(ctx: ReleaseContext, tasks: ReleaseTask[]) {
  for (const task of tasks) {
    await runTask(ctx, task)
  }
}

export async function runTask(ctx: ReleaseContext, task: ReleaseTask) {
  if (typeof task === 'string') {
    await ctx.run(task)
  } else if (typeof task === 'function') {
    await task(ctx)
  } else {
    await task.task(ctx)
  }
}
