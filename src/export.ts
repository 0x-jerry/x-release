// Export variable should be here, for example export a `defineConfig` function.

import { UserConfig } from './types'

export { UserConfig }

export function defineConfig(conf: UserConfig) {
  return conf
}
