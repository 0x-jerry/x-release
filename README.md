# Node CLI(Command Line Interface) Application Template

Fast way to build a CLI application without bundle, Support dynamic import `mjs, jsx, ts, tsx`.

Todo:

1. [ ] Change name and bin property of `package.json`

Develop:

- `src/export.ts` for export some variables used in this CLI application.
- `src/main.ts` for CLI application entry.
- `src/commands/*` module in this folder will auto installed in runtime.

limitation:

1. Exports variables only working with this CLI application.
2. Only support one command.

Feature:

- Use [esbuild-register] to support dynamic import typescript file.
- Use [jest] and [ts-jest] to test.
- Use [cac] to build command-line application.

[esbuild-register]: https://github.com/egoist/esbuild-register
[jest]: https://github.com/facebook/jest
[ts-jest]: https://github.com/kulshekhar/ts-jest
[cac]: https://github.com/cacjs/cac
