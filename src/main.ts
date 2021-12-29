import { CAC } from 'cac'
import assert from 'assert'
import pkg from '../package.json'
import path from 'path'
import { CommandMod } from './commands/_types'
import { logger } from './utils/dev'
import { requireAll } from './utils/utils'

const name = Object.keys(pkg.bin || {})[0]
assert(name, 'Please fill bin property in package.json.')

const cli = new CAC(name)

cli.help()

cli.version(pkg.version)

const mods = requireAll<CommandMod>(path.join(__dirname, 'commands'), (name) =>
  name.startsWith('_')
)

for (const mod of mods) {
  logger.log('install module: %s', mod.name)

  mod.module.install(cli)
}

cli.parse()
