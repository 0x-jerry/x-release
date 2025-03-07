import { sleep } from '@0x-jerry/utils'
import { defineConfig } from '../../../src/export'
import { writeFile } from 'node:fs/promises'

const data: string[] = []

export default defineConfig({
  async beforeCommit() {
    await sleep(10)
    data.push('before commit')
  },
  '~test': {
    async runner(cmd) {
      await sleep(10)
      data.push(cmd)
    },
  },
  tasks: [
    async (ctx) => {
      await sleep(10)
      data.push('done')
      await writeFile('./data.json', JSON.stringify(data))
    },
  ],
})
