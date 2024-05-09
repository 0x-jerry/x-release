import { loadConfig } from 'unconfig'
import type { ReleaseConfig, UserConfig } from './types'
import { logger } from './utils/dev'

const confFileName = 'release.conf'

const defaultConfig: ReleaseConfig = {
  publish: true,
  tasks: [],
  commit: 'chore: release ${prefix}v${version}',
  tag: '${prefix}v${version}',
}

export async function getConf() {
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

  return res.config || {}
}

export async function resolveConfig(opt: UserConfig) {
  const definedProps = (obj: UserConfig) =>
    Object.fromEntries(Object.entries(obj).filter(([k, v]) => v !== undefined))

  const config: ReleaseConfig = Object.assign(
    defaultConfig,
    definedProps(await getConf()),
    definedProps({
      publish: opt.publish,
      commit: opt.commit,
      tag: opt.tag,
    })
  )

  logger.log('resolve config:', config)

  return config
}
