import { ReleaseTask } from './commands/_types'

export interface CliConfig {
  sequence: ReleaseTask[]
}

export type UserConfig = Partial<CliConfig>
