import prompts, { Choice } from 'prompts'
import semver, { ReleaseType } from 'semver'
import assert from 'assert'

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
export async function resolveVersion(
  currentVersion: string,
  type?: string,
  nextVersion?: string
): Promise<string> {
  assert(semver.valid(currentVersion), 'Current version is not valid')

  const releaseType =
    // @ts-expect-error
    releaseTypes.includes(type) ? (type as ReleaseType) : undefined

  if (releaseType) {
    return semver.inc(currentVersion, releaseType)!
  }

  if (nextVersion) {
    if (semver.valid(nextVersion)) {
      return nextVersion
    } else {
      console.log('Input version is not valid, please choose one:')
    }
  }

  const options: Choice[] = releaseTypes.map((type) => {
    const nextVersion = semver.inc(currentVersion, type)!

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

  const answer = await prompts({
    type: 'select',
    name: 'nextVersion',
    message: 'Pick a release version',
    choices: options,
    initial: 1,
  })

  assert(answer.nextVersion, 'Canceled!')

  return answer.nextVersion
}
