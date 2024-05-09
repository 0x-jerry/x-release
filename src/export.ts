import type { UserConfig } from './types'

import { InternalReleaseTask } from './internalReleaseTask'

export { InternalReleaseTask }
export type { UserConfig }

export function defineConfig(conf: UserConfig) {
  return conf
}
