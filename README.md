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
  $ x-release [new-version]

Commands:
  [new-version]  the tasks to run.

Example:

- x-release --patch
- x-release 0.0.1
- x-release 0.1.1 --publish false


For more info, run any command with the `--help` flag:
  $ x-release --help

Options:
  --patch                auto-increment patch version number
  --minor                auto-increment minor version number
  --major                auto-increment major version number
  --prepatch             auto-increment prepatch version number
  --preminor             auto-increment preminor version number
  --premajor             auto-increment premajor version number
  --prerelease           auto-increment prerelease version number
  --publish              run npm publish, default is true
  --tag <tag-tpl>        new tag format, default is: "v${version}"
  --commit <commit-tpl>  the commit message template, default is: "chore: release v${version}"
  -h, --help             Display this message
  -v, --version          Display version number
```

## Configuration

Config file: `release.conf.ts`

Example config file:

```ts
import { defineConfig } from '@0x-jerry/x-release'

export default defineConfig({
  /**
   * run npm publish, default true
   */
  publish: true,
  /**
   * tag template
   */
  tag: '${prefix}v${version}',
  /**
   * commit template
   */
  commit: 'chore: release ${prefix}v${version}',
  /**
   * run tasks after bump version
   */
  tasks: [
    'npm test', // run npm test
    async (ctx) => {
      console.log('new version is:', ctx.nextVersion)

      await ctx.run(`echo "custom script, all tasks are finished!"`)
    },
  ],
})
```

Package.json `release`

```json
{
  "release": {
    "publish": true,
    "tag": "${prefix}v${version}",
    "commit": "chore: release ${prefix}v${version}",
    "tasks": [
      "npm run test",
      "echo 'run custom script after bump version'",
      "echo 'this should be the last script'"
    ]
  }
}
```
