import { CAC } from 'cac'
import assert from 'assert'
import pkg from '../package.json'
import { install } from './commands/default'

const name = Object.keys(pkg.bin || {})[0]
assert(name, 'Please fill bin property in package.json.')

const cli = new CAC(name)

cli.help()

cli.version(pkg.version)

install(cli)

cli.parse()
