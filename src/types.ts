import type { PackageFile } from '@0x-jerry/load-pkg'

export interface ReleaseConfig {
  /**
   * @default true
   */
  publish: boolean

  /**
   * tasks to run,
   *
   */
  tasks: ReleaseTask[]

  /**
   * Commit template, example:
   *
   * "chore: release v${version}"
   *
   * @default "chore: release v${version}"
   */
  commit: string

  /**
   * Tag template, example:
   *
   * "scope@v${version}"
   *
   * @default "v${version}"
   */
  tag: string
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

export interface Task {
  (ctx: ReleaseContext): void | Promise<void>
}

export interface NamedTask {
  name: string
  task: Task
}

export type ReleaseTask = Task | NamedTask | string
