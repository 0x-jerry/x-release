import fs from 'fs'
import path from 'path'
export type NpmTool = 'npm' | 'yarn' | 'pnpm'

let cache: NpmTool | undefined

export function detectNpmTool(cwd = process.cwd()) {
  if (cache) return cache

  const isExist = (file: string) => fs.existsSync(path.resolve(cwd, file))

  if (isExist('package-lock.json')) {
    cache = 'npm'
  } else if (fs.existsSync('pnpm-lock.yaml')) {
    cache = 'pnpm'
  } else if (fs.existsSync('yarn.lock')) {
    cache = 'yarn'
  } else {
    cache = 'npm'
  }

  return cache
}
