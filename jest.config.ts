import type { Config } from '@jest/types'

const conf: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
}

export default conf
