import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    // 20s
    testTimeout: 20_000,
  },
})
