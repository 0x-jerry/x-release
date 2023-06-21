import { bin } from './package.json'
import assert from 'assert'

const name = Object.keys(bin || {})[0]

assert(name, 'Please fill bin property in package.json.')

const env = (process.env.DEBUG || '').split(',').filter(Boolean)

if (name) {
  env.push(name, `${name}:*`)
}

// set DEBUG env
process.env.DEBUG = [...new Set([...env])].join(',')

import('./src/main')
