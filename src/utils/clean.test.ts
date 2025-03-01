import { mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { clean } from './clean'

describe('clean', () => {
  const cwd = path.join(__dirname, 'temp')
  beforeEach(async () => {
    /**
     * - temp
     *  - folder
     *    - text.txt
     *    - subFolder
     *  - folder2
     *    - text.txt
     */

    await mkdir(path.join(cwd, 'folder/subFolder/xx'), { recursive: true })
    await writeFile(path.join(cwd, 'folder/text.txt'), '1')

    await mkdir(path.join(cwd, 'folder2'), { recursive: true })
    await writeFile(path.join(cwd, 'folder2/text.txt'), '1')
  })

  afterEach(async () => {
    await rm(cwd, { force: true, recursive: true })
  })

  it('should clean folder', async () => {
    await clean(['folder'], cwd)
    const files = await readdir(path.join(cwd, 'folder'))
    expect(files.length).toBe(0)
  })

  it('should not clean folder2', async () => {
    await clean(['../folder2'], path.join(cwd, 'folder'))
    const files = await readdir(path.join(cwd, 'folder2'))
    expect(files.length).toBe(1)
  })

  it('should do nothing when folder is not exists', async () => {
    await clean(['folder3'], cwd)
  })
})
