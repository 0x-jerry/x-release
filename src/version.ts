import assert from 'node:assert'
import { exec } from '@0x-jerry/utils/node'
import prompts, { type Choice } from 'prompts'
import semver, { type ReleaseType } from 'semver'
import { logger } from './utils/dev'

export const releaseTypes: ReleaseType[] = [
  'patch',
  'minor',
  'major',
  'prerelease',
  'prepatch',
  'preminor',
  'premajor',
]

/**
 * Resolve next version use opt or nextVersion
 * @param currentVersion
 * @param opt
 * @param nextVersion
 */
export async function resolveVersion(opt: {
  currentVersion: string
  type?: ReleaseType
  nextVersion?: string
  /**
   * @default 'beta'
   */
  semverIdentifier?: string
}): Promise<string> {
  const { currentVersion, type, nextVersion, semverIdentifier = 'beta' } = opt

  assert(semver.valid(currentVersion), 'Current version is not valid')

  if (type) {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    return semver.inc(currentVersion, type)!
  }

  if (nextVersion) {
    if (semver.valid(nextVersion)) {
      return nextVersion
    }

    console.log('Input version is not valid, please choose one:')
  }

  const options: Choice[] = releaseTypes.map((type) => {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const nextVersion = semver.inc(currentVersion, type, semverIdentifier)!

    return {
      title: nextVersion,
      description: type,
      value: nextVersion,
    }
  })

  options.unshift({
    title: currentVersion,
    description: 'current',
    value: currentVersion,
  })

  const recommendedNextVersionType = await detectNextVersionType()

  const idx = recommendedNextVersionType
    ? releaseTypes.indexOf(recommendedNextVersionType)
    : 0

  const answer = await prompts({
    type: 'select',
    name: 'nextVersion',
    message: 'Pick a release version',
    choices: options,
    initial: idx + 1,
  })

  // auto detect by git log

  assert(answer.nextVersion, 'Canceled!')

  return answer.nextVersion
}

async function detectNextVersionType(): Promise<semver.ReleaseType | false> {
  try {
    const tag = await exec('git describe --tags --abbrev=0', {
      collectOutput: true,
    })

    const logs = await exec(
      `git --no-pager log ${tag.trim()}..HEAD --pretty=oneline`,
      {
        collectOutput: true,
      },
    )

    let type: ReleaseType = 'patch'

    const lines = logs.split(/\n/g)

    for (const log of lines) {
      const segments = log.split(/\s+/g)
      for (const seg of segments) {
        if (seg.endsWith(':')) {
          if (seg.includes('!')) {
            type = 'major'
            return type
          }

          if (seg.includes('feat')) {
            type = 'minor'
          }
        }
      }
    }

    return type
  } catch (error) {
    logger.error('detect next version failed, ignore:', error)
    return false
  }
}
