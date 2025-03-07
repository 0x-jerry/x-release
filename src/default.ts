import path from 'node:path'
import { loadPkg } from '@0x-jerry/load-pkg'
import { exec } from '@0x-jerry/utils/node'
import type { CAC } from 'cac'
import pc from 'picocolors'
import type { ReleaseType } from 'semver'
import { resolveConfig } from './config'
import { runTasks } from './helper'
import { defaultTasks } from './internalReleaseTask'
import type { ReleaseConfig, ReleaseContext, ReleaseTask } from './types'
import { logger } from './utils/dev'
import { releaseTypes, resolveVersion } from './version'

const taskDescribe = `the tasks to run.

Example:

- x-release --patch
- x-release 0.0.1
- x-release 0.1.1 --publish false
`

interface ReleaseCommandOption {
  major?: boolean
  minor?: boolean
  premajor?: boolean
  preminor?: boolean
  prerelase?: boolean
  prerelease?: boolean

  publish?: boolean
  tag?: string
  commit?: string
}

export const install = (cac: CAC) => {
  // default command
  cac
    .command('[new-version]', taskDescribe)
    .option('--patch', 'auto-increment patch version number')
    .option('--minor', 'auto-increment minor version number')
    .option('--major', 'auto-increment major version number')
    .option('--prepatch', 'auto-increment prepatch version number')
    .option('--preminor', 'auto-increment preminor version number')
    .option('--premajor', 'auto-increment premajor version number')
    .option('--prerelease', 'auto-increment prerelease version number')
    .option('--publish', 'run npm publish, default is true')
    .option('--tag <tag-tpl>', 'new tag format, default is: "v${version}"')
    .option(
      '--commit <commit-tpl>',
      'the commit message template, default is: "chore: release v${version}"',
    )
    .action(action)
}

async function action(newVersion: string, opt: ReleaseCommandOption = {}) {
  logger.log('tasks: %o', newVersion)
  logger.log('opt: %o', opt)

  const releaseType = (Object.keys(opt) as ReleaseType[])
    .filter((key) => releaseTypes.includes(key))
    .at(0)

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
      nextVersion: newVersion,
    })

    logger.log('next version is: %s', nextVersion)

    const pkgDir = path.dirname(pkg.path)

    // change `process.cwd()`
    process.chdir(pkgDir)

    const config: ReleaseConfig = await resolveConfig({
      publish: opt.publish,
      commit: opt.commit,
      tag: opt.tag,
    })

    const ctx: ReleaseContext = {
      cwd: pkgDir,
      package: pkg,
      currentVersion: pkg.config.version,
      nextVersion,
      conf: config,
      run: async (cmd) => {
        const runner = config['~test']?.runner || exec
        await runner(cmd)
      },
    }

    const tasks: ReleaseTask[] = [...defaultTasks, ...config.tasks]

    await runTasks(ctx, tasks)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}
