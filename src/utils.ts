import fs from 'fs'
import path from 'path'

export function requireAll<T>(dir: string, exclude?: (filename: string) => boolean) {
  const files = fs.readdirSync(dir)

  const modules: T[] = []
  for (const file of files) {
    if (!file.endsWith('.ts') || (exclude && exclude(file))) {
      continue
    }

    const filePath = path.join(dir, file)

    const module = require(filePath) as T

    modules.push(module)
  }

  return modules
}
