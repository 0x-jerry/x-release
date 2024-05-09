import { cliName } from './src/utils/pkgConf'

const env = (process.env.DEBUG || '').split(',').filter(Boolean)

env.push(cliName, `${cliName}:*`)

// set DEBUG env
process.env.DEBUG = [...new Set([...env])].join(',')

import('./src/cli')
