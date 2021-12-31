import { ReleaseTask } from './commands/_types'

export interface CliConfig {
  sequence: ReleaseTask[]

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

export type UserConfig = Partial<CliConfig>
