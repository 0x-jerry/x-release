const { register } = require('esbuild-register/dist/node')
const tsConfig = require('./tsconfig.json')

register({
  tsconfigRaw: tsConfig,
})

// start main
module.exports = require('./src/main')
