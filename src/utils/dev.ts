import debug from 'debug'
import { cliName } from './pkgConf'

export function createLogger(ns?: string) {
  const name = cliName

  if (!ns) {
    return debug(name)
  }

  return debug(`${name}:${ns}`)
}

export const logger = {
  log: createLogger(),
  warn: createLogger('warn'),
  error: createLogger('error'),
}
