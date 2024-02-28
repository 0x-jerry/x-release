# X-Release

A tool that helps you to create a new release quickly.

## Install

```sh
pnpm i @0x-jerry/x-release -D
# or
pnpm i @0x-jerry/x-release -g
```

## Usage

```
Usage:
  $ x-release [...tasks]

Commands:
  [...tasks]  the tasks to run.

Example:

- "x-release npm:test": run scripts.test in package.json
- "x-release run:echo 'hello'": run "echo 'hello'" in shell

Internal tasks:

- "x-release pkg.update.version": update version property in package.json
- "x-release npm.publish": publish to npm
- "x-release git.commit": create a commit
- "x-release git.tag": create a new tag
- "x-release git.push": push to remote

Combine tasks example: "x-release npm:test pkg.update.version git.commit git.tag git.push npm:build npm.publish"

This will run the below tasks:

1. update version in package.json
2. git add .
3. git commit -m "<commit msg>"
4. git push && git push --tags
5. npm publish --new-version <new-version>


For more info, run any command with the `--help` flag:
  $ x-release --help

Options:
  --new-version  specified the exact new version
  --patch        auto-increment patch version number
  --minor        auto-increment minor version number
  --major        auto-increment major version number
  --prepatch     auto-increment prepatch version number
  --preminor     auto-increment preminor version number
  --premajor     auto-increment premajor version number
  --prerelease   auto-increment prerelease version number
  -h, --help     Display this message
  -v, --version  Display version number
```

## Configuration

Config file: `x.release.conf.ts`

Example config file:

```ts
import { defineConfig } from '@0x-jerry/x-release'

export default defineConfig({
  sequence: [
    'npm:test', // execute npm run test
    'pkg.update.version', // update version property of package.json
    'git.commit', // execute git add . && git commit -m "${commit msg}"
    'git.tag', // execute git tag "v${new-version}"
    'git.push', // execute git push && git push --tags
    'npm:build', // execute npm run build
    'npm.publish', // execute npm publish --tag ${new-version}
    'run:echo "custom task"', // execute echo "custom task"
    async (ctx) => {
      console.log('new version is:', ctx.nextVersion)

      await ctx.run(`echo "custom script, all tasks are finished!"`)
    },
  ],
})
```
