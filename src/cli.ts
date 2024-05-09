import { CAC } from 'cac'
import { version } from '../package.json'
import { install } from './default'
import { cliName } from './utils/pkgConf'

const cli = new CAC(cliName)

cli.help()

cli.version(version)

install(cli)

cli.parse()
