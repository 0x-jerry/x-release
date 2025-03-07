import { loadConfig } from 'unconfig'
import type { ReleaseConfig, UserConfig } from './types'
import { logger } from './utils/dev'

const confFileName = 'release.conf'

export async function getConf() {
  const res = await loadConfig<UserConfig>({
    sources: [
      {
        files: confFileName,
      },

      {
        files: 'package.json',
        extensions: [],
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        rewrite(config: any) {
          return config?.release
        },
      },
    ],
  })

  return res.config || {}
}

export async function resolveConfig(opt: UserConfig) {
  const configFile = await getConf()

  const config: ReleaseConfig = {
    ...configFile,
    publish: opt.publish ?? configFile.publish ?? true,
    tasks: configFile.tasks ?? [],
    commit:
      opt.commit ?? configFile.commit ?? 'chore: release ${prefix}v${version}',
    tag: opt.tag ?? configFile.tag ?? '${prefix}v${version}',
  }

  logger.log('resolve config:', config)

  return config
}
