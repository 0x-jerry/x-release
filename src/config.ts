import { loadConfig } from 'unconfig'
import type { UserConfig } from './types'

let cache: UserConfig

const confFileName = 'release.conf'

export async function getConf(reload = false) {
  if (cache && !reload) return cache

  const res = await loadConfig<UserConfig>({
    sources: [
      {
        files: confFileName,
      },

      {
        files: 'package.json',
        extensions: [],
        rewrite(config: any) {
          return config?.release
        },
      },
    ],
  })

  cache = res.config || {}

  return cache
}
