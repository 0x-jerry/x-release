import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/cli.ts', 'src/export.ts'],
  platform: 'node',
  dts: true,
  clean: true,
  format: ['esm'],
})
