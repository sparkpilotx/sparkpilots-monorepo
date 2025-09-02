import { describe, it, expect } from 'vitest'
import { checkExhaustive } from './checks'

describe('checkExhaustive', () => {
  it('throws with default message including value', () => {
    expect(() => checkExhaustive('x' as never)).toThrowError(
      /unexpected value x/
    )
  })

  it('throws with custom message', () => {
    expect(() => checkExhaustive('y' as never, 'boom')).toThrowError('boom')
  })
})
