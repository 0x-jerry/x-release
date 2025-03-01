import { existsSync } from 'node:fs'
import path from 'node:path'
import { readdir, rm, stat } from 'node:fs/promises'
/**
 * clean folders that is inside of the `cwd` path, do not thing if it is outside of the `cwd` path
 * @param folders
 * @param cwd
 */
export async function clean(folders: string[], cwd: string) {
  for (const folder of folders) {
    const p = path.join(cwd, folder)

    // skip relative path
    if (!path.isAbsolute(p)) {
      continue
    }

    if (path.relative(cwd, p).startsWith('..')) {
      continue
    }

    if (!existsSync(p)) {
      continue
    }

    const info = await stat(p)

    if (!info.isDirectory()) {
      continue
    }

    await cleanFolder(p)
  }
  //
}

async function cleanFolder(folderPath: string) {
  const files = await readdir(folderPath)
  for (const file of files) {
    const subPath = path.join(folderPath, file)

    await rm(subPath, { recursive: true })
  }
}
