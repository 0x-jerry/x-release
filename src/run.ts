import execa from 'execa'
import pc from 'picocolors'

export async function run(cmd: string) {
  console.log(pc.dim('$'), pc.dim(cmd))

  await execa('sh', ['-c', cmd], { stdio: 'inherit' })
}
