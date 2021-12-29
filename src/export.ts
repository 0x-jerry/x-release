// Export variable should be here, for example export a `defineConfig` function.

import { UserConfig } from './types'

import { InternalReleaseTask } from './internalReleaseTask'

export { UserConfig, InternalReleaseTask }

export function defineConfig(conf: UserConfig) {
  return conf
}
