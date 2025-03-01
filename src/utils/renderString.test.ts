import { renderString } from './renderString'

describe('render string', () => {
  it('render variable', () => {
    const r = renderString('${prefix}v${version}', {
      version: '0.0.1',
      prefix: 'xx@',
    })
    expect(r).toBe('xx@v0.0.1')
  })
})
