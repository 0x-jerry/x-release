import type { PackageFile } from '@0x-jerry/load-pkg'

export interface ReleaseConfig {
  /**
   * @default true
   */
  publish: boolean

  /**
   * Run custom tasks after bump version
   *
   * @example ['npm run test', (ctx) => ctx.run(`npm run test`)]
   *
   */
  tasks: ReleaseTask[]

  /**
   * Commit template, supported vairables: version
   *
   * @default "chore: release v${version}"
   */
  commit: string

  /**
   * Tag template, supported vairables: version
   *
   * @default "v${version}"
   */
  tag: string

  /**
   * Clear those folders before run npm publish, only available when `publish` is true
   *
   * Only support relative path
   */
  clean?: string[]

  /**
   * Run this task before git commit
   */
  beforeCommit?: ReleaseTask

  /**
   * Only for unit test
   *
   * @private
   */
  '~test'?: {
    runner: ReleaseContext['run']
    [key: string]: unknown
  }
}

export type UserConfig = Partial<ReleaseConfig>

export interface ReleaseContext {
  /**
   * The directory contain a `package.json` file.
   */
  cwd: string
  package: PackageFile
  conf: ReleaseConfig
  currentVersion: string
  nextVersion: string
  run: (cmd: string) => void | Promise<void>
}

export type Task = (ctx: ReleaseContext) => void | Promise<void>

export interface NamedTask {
  name: string
  task: Task
}

export type ReleaseTask = Task | NamedTask | string
