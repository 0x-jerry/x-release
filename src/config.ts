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
  const configFileConfig = await getConf()

  const config: ReleaseConfig = {
    ...configFileConfig,
    publish: opt.publish ?? configFileConfig.publish ?? false,
    tasks: configFileConfig.tasks ?? [],
    commit:
      opt.commit ?? configFileConfig.commit ?? 'chore: release ${prefix}v${version}',
    tag: opt.tag ?? configFileConfig.tag ?? '${prefix}v${version}',
  }

  logger.info('resolve config:', config)

  return config
}
