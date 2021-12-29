import pkg from '../package.json'
import assert from 'assert'

export function cliName() {
  const name = Object.keys(pkg.bin || {})[0]
  assert(name, 'Please fill bin property in package.json.')

  return name
}
