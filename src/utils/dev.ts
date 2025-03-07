import debug from 'debug'
import { cliName } from './pkgConf'

export function createLogger(ns?: string) {
  const name = cliName

  if (!ns) {
    return debug(name)
  }

  return debug(name).extend(ns)
}

export function enableLogger() {
  debug.enable(`${cliName},${cliName}:*`)
}

export const logger = {
  info: createLogger(),
  warn: createLogger('warn'),
  error: createLogger('error'),
}
