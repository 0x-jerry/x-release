import { CommandInstall } from './_types'

export const install: CommandInstall = (cac) => {
  // default command
  cac.command('').action(() => cac.outputHelp())
}
