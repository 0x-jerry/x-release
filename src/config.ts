import { loadConfig } from 'unconfig'
import { UserConfig } from './types'

export async function getConf() {
  const res = await loadConfig<UserConfig>({
    sources: [
      // load from `x.release.xx`
      {
        files: 'x.release',
      },
    ],
  })

  return res.config
}
