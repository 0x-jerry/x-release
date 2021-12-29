const pkg = require('./package.json')
assert = require('assert')

const name = Object.keys(pkg.bin || {})[0]

assert(name, 'Please fill bin property in package.json.')

const env = (process.env.DEBUG || '').split(',').filter(Boolean)

if (name) {
  env.push(name, `${name}:*`)
}

// set DEBUG env
process.env.DEBUG = [...new Set([...env])].join(',')

require('./cli.js')
