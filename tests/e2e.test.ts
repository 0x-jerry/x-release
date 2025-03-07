import { exec, readJson } from '@0x-jerry/utils/node'
import { runInProjectDir } from './utils'
import { resolveConfig } from '../src/config'

describe('e2e', () => {
  it('resolve config', async () => {
    await runInProjectDir('resolve-config', async () => {
      const resp = await resolveConfig({})
      expect(resp.beforeCommit).instanceOf(Function)
      expect(resp['~test']?.runner).instanceOf(Function)
    })
  })

  it('release workflow', async () => {
    await runInProjectDir('release-workflow', async () => {
      const cliScriptPath = '../../../src/cli.ts'
      await exec(`npx tsx ${cliScriptPath} --patch`)

      const data = await readJson('data.json')

      expect(data).toEqual([
        'before commit',
        'git add .',
        'git commit -m "chore: release test@v1.0.1"',
        'git tag "test@v1.0.1"',
        'git push',
        'git push --tags',
        'npm publish',
        'done',
      ])
    })
  })
})
