import {
  CommandInstall,
  ExecScriptPrefix,
  NpmScriptPrefix,
  ReleaseContext,
  ReleaseOption,
  ReleaseTask,
} from './_types'
import { releaseTypes, resolveVersion } from '../version'
import { InternalReleaseTask, internalTasks, isInternalTask } from '../internalReleaseTask'
import { run } from '../run'
import { logger } from '../utils/dev'
import { getConf } from '../modules/config'
import { detectNpmTool } from '../utils/npmTool'
import path from 'path'
import pc from 'picocolors'
import { loadPkg } from '@0x-jerry/load-pkg'

const taskDescribe = `the tasks to run.

Example:

- "x-release npm:test": run scripts.test in package.json
- "x-release run:echo 'hello'": run "echo 'hello'" in shell

Internal tasks:

- "x-release pkg.update.version": update version property in package.json
- "x-release npm.publish": publish to npm
- "x-release git.commit": create a commit
- "x-release git.tag": create a new tag
- "x-release git.push": push to remote

Combine tasks example: "x-release npm:test pkg.update.version git.commit git.tag git.push npm:build npm.publish"

This will run the below tasks:

1. update version in package.json
2. git add .
3. git commit -m "<commit msg>"
4. git push && git push --tags
5. npm publish
`

export const install: CommandInstall = (cac) => {
  // default command
  cac
    .command('[...tasks]', taskDescribe)
    .option('--new-version', 'specified the exact new version')
    .option('--patch', 'auto-increment patch version number')
    .option('--minor', 'auto-increment minor version number')
    .option('--major', 'auto-increment major version number')
    .option('--prepatch', 'auto-increment prepatch version number')
    .option('--preminor', 'auto-increment preminor version number')
    .option('--premajor', 'auto-increment premajor version number')
    .option('--prerelease', 'auto-increment prerelease version number')
    .option('--tag <tag-tpl>', 'new tag format, default is: "v${version}"')
    .option(
      '--commit <commit-tpl>',
      'the commit message template, default is: "chore: release v${version}"'
    )
    .option('--npm <npm-tool>', 'specified npm manager tool, default will check lockfile')
    .action(action)
}

async function action(cliTasks: string[] = [], opt: ReleaseOption = {}) {
  logger.log('tasks: %o', cliTasks)
  logger.log('opt: %o', opt)

  const releaseType = Object.keys(opt).filter((key) =>
    // @ts-expect-error
    releaseTypes.includes(key)
  )[0]

  logger.log('releaseType: %s', releaseType)

  try {
    const pkg = await loadPkg(process.cwd())
    if (!pkg) {
      console.log(pc.red(`Not found package.json file at: ${process.cwd()}`))
      return
    }

    const nextVersion = await resolveVersion({
      currentVersion: pkg.config.version,
      type: releaseType,
      nextVersion: opt.newVersion,
    })

    logger.log('next version is: %s', nextVersion)

    const pkgDir = path.parse(pkg.path).dir
    // change `process.cwd()`
    process.chdir(pkgDir)

    const ctx: ReleaseContext = {
      cwd: pkgDir,
      package: pkg,
      options: opt,
      currentVersion: pkg.config.version,
      nextVersion,
      run,
      runNpm(cmd) {
        const tool = opt.npm || detectNpmTool(ctx.cwd)
        return run(`${tool} ${cmd}`)
      },
    }

    // default tasks
    const defaultTasks: ReleaseTask[] = [
      InternalReleaseTask.updatePkg,
      InternalReleaseTask.commit,
      InternalReleaseTask.tag,
      InternalReleaseTask.push,
      InternalReleaseTask.publish,
    ]

    const conf = await getConf()

    const tasks: ReleaseTask[] = conf.sequence?.length
      ? conf.sequence
      : cliTasks.length
      ? (cliTasks as ReleaseTask[])
      : defaultTasks

    await runTasks(ctx, tasks)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

async function runTasks(ctx: ReleaseContext, tasks: ReleaseTask[]) {
  for (const task of tasks) {
    await runTask(ctx, task)
  }
}

async function runTask(ctx: ReleaseContext, task: ReleaseTask) {
  const scripts: Record<string, string> = ctx.package.config.scripts || {}

  if (typeof task === 'string') {
    if (isInternalTask(task)) {
      await internalTasks[task](ctx)
      return
    }

    // check run:xxxx, shell task
    if (task.startsWith(ExecScriptPrefix)) {
      await ctx.run(task.slice(ExecScriptPrefix.length).trim())
      return
    }

    // check npm:xxx, npm task
    if (task.startsWith(NpmScriptPrefix)) {
      const taskName = task.slice(NpmScriptPrefix.length)
      const scriptTask = scripts[taskName]
      if (scriptTask) {
        await ctx.runNpm(`run ${taskName}`)
        return
      }
    }

    logger.warn(`Can't found task %s`, task)
  } else {
    await task(ctx)
  }
}
