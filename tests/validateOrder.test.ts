import { describe, expect, it } from 'vitest'
import { validateOrder } from '../shared/utils/validateOrder'

function isoDateOffset(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

function validOrder(overrides: Partial<Parameters<typeof validateOrder>[0]> = {}) {
  return {
    firstName: 'Ada',
    lastName: 'Lovelace',
    pickupDate: isoDateOffset(1),
    breadQty: 2,
    rollQty: 4,
    ...overrides
  }
}

describe('validateOrder', () => {
  it('accepts a fully valid order', () => {
    const { valid, errors } = validateOrder(validOrder())
    expect(valid).toBe(true)
    expect(errors).toEqual({})
  })

  it('accepts today as the pickup date', () => {
    const { valid } = validateOrder(validOrder({ pickupDate: isoDateOffset(0) }))
    expect(valid).toBe(true)
  })

  it('requires a first name', () => {
    const { valid, errors } = validateOrder(validOrder({ firstName: '  ' }))
    expect(valid).toBe(false)
    expect(errors.firstName).toBeDefined()
  })

  it('requires a last name', () => {
    const { valid, errors } = validateOrder(validOrder({ lastName: '' }))
    expect(valid).toBe(false)
    expect(errors.lastName).toBeDefined()
  })

  it('rejects a pickup date in the past', () => {
    const { valid, errors } = validateOrder(validOrder({ pickupDate: isoDateOffset(-1) }))
    expect(valid).toBe(false)
    expect(errors.pickupDate).toBeDefined()
  })

  it('rejects a missing pickup date', () => {
    const { valid, errors } = validateOrder(validOrder({ pickupDate: '' }))
    expect(valid).toBe(false)
    expect(errors.pickupDate).toBeDefined()
  })

  it('rejects negative quantities', () => {
    const { valid, errors } = validateOrder(validOrder({ breadQty: -1 }))
    expect(valid).toBe(false)
    expect(errors.breadQty).toBeDefined()
  })

  it('rejects non-integer quantities', () => {
    const { valid, errors } = validateOrder(validOrder({ rollQty: 2.5 }))
    expect(valid).toBe(false)
    expect(errors.rollQty).toBeDefined()
  })

  it('rejects quantities above the maximum', () => {
    const { valid, errors } = validateOrder(validOrder({ breadQty: 101 }))
    expect(valid).toBe(false)
    expect(errors.breadQty).toBeDefined()
  })

  it('requires at least one bread or roll', () => {
    const { valid, errors } = validateOrder(validOrder({ breadQty: 0, rollQty: 0 }))
    expect(valid).toBe(false)
    expect(errors.breadQty).toBeDefined()
    expect(errors.rollQty).toBeDefined()
  })

  it('accepts an order with only rolls', () => {
    const { valid } = validateOrder(validOrder({ breadQty: 0, rollQty: 3 }))
    expect(valid).toBe(true)
  })
})
