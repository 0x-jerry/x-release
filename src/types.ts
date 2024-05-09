import type { PackageFile } from '@0x-jerry/load-pkg'
import type { CAC } from 'cac'

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

export interface ReleaseCommandOption {
  major?: boolean
  minor?: boolean
  premajor?: boolean
  preminor?: boolean
  prerelase?: boolean
  prerelease?: boolean
  newVersion?: string

  publish?: boolean
  tag?: string
  commit?: string
}

export interface ReleaseContext {
  /**
   * The directory contain a `package.json` file.
   */
  cwd: string
  package: PackageFile
  currentVersion: string
  nextVersion: string
  run: (cmd: string) => void | Promise<void>
  options: ReleaseCommandOption
}

export interface TaskRunner {
  (ctx: ReleaseContext): void | Promise<void>
}

export type ReleaseTask = TaskRunner | string
