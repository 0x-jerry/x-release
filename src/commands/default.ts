import { CommandInstall, ReleaseContext, ReleaseTask } from './_types'
import { resolveVersion } from '../version'
import { error, log, warn } from '../dev'
import { readPackage } from '../package'
import { InternalReleaseTask, internalTasks, isInternalTask } from '../internalReleaseTask'
import execa from 'execa'
import { getConf } from '../config'

export const install: CommandInstall = (cac) => {
  // default command
  cac
    .command('[new-version]')
    .option('--patch', 'auto-increment patch version number')
    .option('--minor', 'auto-increment minor version number')
    .option('--major', 'auto-increment major version number')
    .option('--prepatch', 'auto-increment prepatch version number')
    .option('--preminor', 'auto-increment preminor version number')
    .option('--premajor', 'auto-increment premajor version number')
    .option('--prerelease', 'auto-increment prerelease version number')
    .action(action)
}

interface ReleaseOption {
  major?: boolean
  minor?: boolean
  premajor?: boolean
  preminor?: boolean
  prerelase?: boolean
  prerelease?: boolean
}

async function action(version: string, opt: ReleaseOption = {}) {
  const releaseType = Object.keys(opt).filter(
    (key) =>
      // @ts-expect-error
      !!opt[key]
  )[0]

  try {
    const pkg = await readPackage()

    const nextVersion = await resolveVersion(pkg.version, releaseType, version)
    log('next version is: %s', nextVersion)

    const ctx: ReleaseContext = {
      package: pkg,
      nextVersion,
      run,
    }

    // default tasks
    const defaultTasks: ReleaseTask[] = [
      'test',
      'build',
      'changelog',
      InternalReleaseTask.syncToGit,
      InternalReleaseTask.publishToNpm,
    ]

    const conf = await getConf()

    const tasks = conf.sequence?.length ? conf.sequence : defaultTasks

    await runTasks(ctx, tasks)
  } catch (err) {
    error('%s', err)
    return
  }
}

async function runTasks(ctx: ReleaseContext, tasks: ReleaseTask[]) {
  const scripts: Record<string, string> = ctx.package.scripts || {}

  for (const task of tasks) {
    if (typeof task === 'string') {
      if (isInternalTask(task)) {
        await internalTasks[task](ctx)
      } else if (scripts[task]) {
        await ctx.run(`yarn run ${task}`)
      } else {
        warn(`Can't found task %s`, task)
      }
    } else {
      await task(ctx)
    }
  }
}

async function run(cmd: string) {
  console.log('$', cmd)

  const [bin, ...args] = cmd.split(/\s+/g)
  await execa(bin, args, { stdio: 'pipe' })
}
