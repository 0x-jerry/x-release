import fs from 'fs/promises'
import path from 'path'

export async function readPackage(cwd: string = process.cwd()) {
  const pkgFile = path.join(cwd, 'package.json')

  const res = await fs.readFile(pkgFile, { encoding: 'utf-8' })

  return JSON.parse(res)
}
