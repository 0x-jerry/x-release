import { loadConfig } from 'unconfig'
import { confFileName } from '../const'
import { UserConfig } from '../types'

let cache: UserConfig

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
