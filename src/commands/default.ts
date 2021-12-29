import { CommandInstall, ReleaseContext, ReleaseTask } from './_types'
import { releaseTypes, resolveVersion } from '../version'
import { readPackage } from '../package'
import { InternalReleaseTask, internalTasks, isInternalTask } from '../internalReleaseTask'
import { run } from '../run'
import { logger } from '../utils/dev'
import { getConf } from '../modules/config'

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
  const releaseType = Object.keys(opt).filter((key) =>
    // @ts-expect-error
    releaseTypes.includes(key)
  )[0]

  logger.log('releaseType: %s', releaseType)

  try {
    const pkg = await readPackage()

    const nextVersion = await resolveVersion(pkg.version, releaseType, version)
    logger.log('next version is: %s', nextVersion)

    const ctx: ReleaseContext = {
      package: pkg,
      nextVersion,
      run,
    }

    // default tasks
    const defaultTasks: ReleaseTask[] = [
      'script:test',
      'script:build',
      InternalReleaseTask.updatePkg,
      InternalReleaseTask.commit,
      InternalReleaseTask.tag,
      InternalReleaseTask.push,
      InternalReleaseTask.publish,
    ]

    const conf = await getConf()

    const tasks = conf.sequence?.length ? conf.sequence : defaultTasks

    await runTasks(ctx, tasks)
  } catch (err) {
    logger.error('%s', err)
    return
  }
}

async function runTasks(ctx: ReleaseContext, tasks: ReleaseTask[]) {
  const scripts: Record<string, string> = ctx.package.scripts || {}

  for (const task of tasks) {
    if (typeof task === 'string') {
      if (isInternalTask(task)) {
        await internalTasks[task](ctx)
      } else if (task.startsWith('run:')) {
        // check run:xxxx
        await ctx.run(task.slice('run:'.length).trim())
      } else if (task.startsWith('script:') && scripts[task.slice('script:'.length)]) {
        // check script:xxx
        await ctx.run(`yarn run ${task}`)
      } else {
        logger.warn(`Can't found task %s`, task)
      }
    } else {
      await task(ctx)
    }
  }
}
