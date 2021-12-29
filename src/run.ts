import execa from 'execa'
import { gray } from 'picocolors'

export async function run(cmd: string) {
  console.log(gray('$'), gray(cmd))

  await execa('sh', ['-c', cmd], { stdio: 'pipe' })
}
