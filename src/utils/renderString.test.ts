import { renderString } from './renderString'

describe('render string', () => {
  it('render variable', () => {
    const r = renderString('v${version}', { version: '0.0.1' })
    expect(r).toBe('v0.0.1')
  })
})
