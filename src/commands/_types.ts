import { CAC } from 'cac'
import { InternalReleaseTask } from '../internalReleaseTask'

export interface CommandInstall {
  (cac: CAC): any
}

export interface CommandMod {
  install: CommandInstall
}

export interface ReleaseContext {
  package: Record<string, any>
  nextVersion: string
  run: (cmd: string) => void | Promise<void>
}

export interface ReleaseTaskRunner {
  (ctx: ReleaseContext): void | Promise<void>
}

export type ReleaseTask = InternalReleaseTask | string | ReleaseTaskRunner
