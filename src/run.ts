import { execa } from 'execa'
import pc from 'picocolors'
import os from 'os'

export async function run(cmd: string) {
  console.log(pc.dim('$'), pc.dim(cmd))

  if (os.platform() === 'win32') {
    // fix escape double quote
    const finalCmd = JSON.stringify(cmd).replaceAll(`\\"`, '`"')

    await execa('powershell', ['Invoke-Expression', finalCmd], {
      stdio: 'inherit',
    })
  } else {
    await execa('sh', ['-c', cmd], { stdio: 'inherit' })
  }
}
