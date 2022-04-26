import fs from 'fs'
import path from 'path'
export type NpmTool = 'npm' | 'yarn' | 'pnpm'

let cache: NpmTool | undefined

export function detectNpmTool(dir: string) {
  if (cache) return cache

  const isExist = (file: string) => fs.existsSync(path.resolve(dir, file))

  if (isExist('package-lock.json')) {
    cache = 'npm'
  } else if (isExist('pnpm-lock.yaml')) {
    cache = 'pnpm'
  } else if (isExist('yarn.lock')) {
    cache = 'yarn'
  } else {
    cache = 'npm'
  }

  return cache
}
