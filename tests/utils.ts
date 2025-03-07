import { existsSync } from 'node:fs'
import { copyFile, mkdir, rm } from 'node:fs/promises'
import path from 'node:path'

const ProjectsDir = 'project'

function getTestProjectDir(projectName: string) {
  const projectDir = path.join(import.meta.dirname, ProjectsDir, projectName)

  return projectDir
}

async function setupTestProject(projectName: string) {
  await _copyFile('package.json')
  await _copyFile('release.conf.ts')

  return

  async function _copyFile(file: string) {
    const sourceFile = path.join(getTestProjectDir('base'), file)
    const destFile = path.join(getTestProjectDir(projectName), file)

    const destDir = path.dirname(destFile)

    await mkdir(destDir, { recursive: true })

    await copyFile(sourceFile, destFile)
  }
}

async function cleanTestProject(projectName: string) {
  const projectDir = getTestProjectDir(projectName)

  if (existsSync(projectDir)) {
    await rm(projectDir, { recursive: true })
  }
}

export async function runInProjectDir(
  projectName: string,
  callback: () => unknown,
) {
  const oldCwd = process.cwd()
  const projectDir = getTestProjectDir(projectName)

  try {
    await setupTestProject(projectName)
    process.chdir(projectDir)
    await callback()
  } catch (error) {
    // biome-ignore lint/complexity/noUselessCatch: <explanation>
    throw error
  } finally {
    process.chdir(oldCwd)
    await cleanTestProject(projectName)
  }
}
