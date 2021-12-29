import { CAC } from 'cac'

export interface CommandInstall {
  (cac: CAC): any
}

export interface CommandMod {
  install: CommandInstall
}
