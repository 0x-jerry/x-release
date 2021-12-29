import { CAC } from 'cac'
import assert from 'assert'
import pkg from '../package.json'
import path from 'path'
import { requireAll } from './utils'
import { CommandMod } from './commands/_types'

const name = Object.keys(pkg.bin || {})[0]
assert(name, 'Please fill bin property in package.json.')

const cli = new CAC(name)

cli.help()

cli.version(pkg.version)

const mods = requireAll<CommandMod>(path.join(__dirname, 'commands'), (name) =>
  name.startsWith('_')
)

for (const mod of mods) {
  mod.install(cli)
}

cli.parse()
