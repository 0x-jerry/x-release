import { exec } from '@0x-jerry/utils/node'
import { runInProjectDir } from './utils'
import { readFile } from 'node:fs/promises'

const TestProjectName = 'release-conf'

describe('e2e', () => {
  it('relese config', async () => {
    await runInProjectDir(TestProjectName, async () => {
      const cliScriptPath = '../../../src/cli.ts'
      await exec(`npx tsx ${cliScriptPath} --patch`)

      const data = await readFile('data.json')

      expect(data).toEqual(['before commit', 'todo', 'done'])
    })
  })
})
