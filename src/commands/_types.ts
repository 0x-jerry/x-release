import { CAC } from 'cac'
import { InternalReleaseTask } from '../internalReleaseTask'

export interface CommandInstall {
  (cac: CAC): any
}

export interface CommandMod {
  install: CommandInstall
}

export interface ReleaseOption {
  major?: boolean
  minor?: boolean
  premajor?: boolean
  preminor?: boolean
  prerelase?: boolean
  prerelease?: boolean
  newVersion?: string

  tag?: string
  commit?: string
  npm?: string
}

export interface ReleaseContext {
  /**
   * The directory contain a `package.json` file.
   */
  cwd: string
  package: Record<string, any>
  nextVersion: string
  run: (cmd: string) => void | Promise<void>
  options: ReleaseOption
  /**
   * example:
   *
   * ```js
   * runNpm("install xx@1") // execute: npm install xx@1
   * ```
   *
   * @param cmd
   */
  runNpm(cmd: string): Promise<void>
}

export interface ReleaseTaskRunner {
  (ctx: ReleaseContext): void | Promise<void>
}

export const NpmScriptPrefix = 'npm:'
export const ExecScriptPrefix = 'run:'

/**
 *  - `script:xxx` will run package.scripts.xxx
 *  - `run: echo "hello"` will run echo "hello"
 */
export type ReleaseStringTask =
  | `${typeof NpmScriptPrefix}${string}`
  | `${typeof ExecScriptPrefix}${string}`
  | `${InternalReleaseTask}`

/**
 *  - `script:xxx` will run package.scripts.xxx
 *  - `run: echo "hello"` will run echo "hello"
 */
export type ReleaseTask = InternalReleaseTask | ReleaseStringTask | ReleaseTaskRunner
