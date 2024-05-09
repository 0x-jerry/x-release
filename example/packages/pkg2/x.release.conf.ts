import { defineConfig, InternalReleaseTask } from '@0x-jerry/x-release'

export default defineConfig({
  tasks: [
    'npm:test',
    InternalReleaseTask.updatePkg,
    'npm:changelog',
    InternalReleaseTask.commit,
    InternalReleaseTask.tag,
    InternalReleaseTask.push,
  ],
})
