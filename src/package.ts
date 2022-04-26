import { loadPkg } from '@0x-jerry/load-pkg'
import fs from 'fs/promises'

export async function readPackage(cwd: string = process.cwd()) {
  const pkgFile = await loadPkg(cwd)
  if (!pkgFile) return null

  const res = await fs.readFile(pkgFile.path, { encoding: 'utf-8' })

  return {
    ...pkgFile,
    config: JSON.parse(res),
  }
}
