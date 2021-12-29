const { register } = require('esbuild-register/dist/node')
const tsConfig = require('./tsconfig.json')

register({
  hookIgnoreNodeModules: false,
  tsconfigRaw: tsConfig,
})

// start main
module.exports = require('./src/main')
