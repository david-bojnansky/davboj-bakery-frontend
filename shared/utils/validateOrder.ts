import type { Order, OrderErrors } from '../types/order'

const NAME_MAX_LENGTH = 60
const QTY_MAX = 100
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function todayAsIsoDate(): string {
  return new Date().toISOString().slice(0, 10)
}

function isValidQty(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= QTY_MAX
}

export function validateOrder(input: Partial<Order>): { valid: boolean, errors: OrderErrors } {
  const errors: OrderErrors = {}

  const firstName = input.firstName?.trim() ?? ''
  if (!firstName) {
    errors.firstName = 'First name is required.'
  } else if (firstName.length > NAME_MAX_LENGTH) {
    errors.firstName = `First name must be ${NAME_MAX_LENGTH} characters or fewer.`
  }

  const lastName = input.lastName?.trim() ?? ''
  if (!lastName) {
    errors.lastName = 'Last name is required.'
  } else if (lastName.length > NAME_MAX_LENGTH) {
    errors.lastName = `Last name must be ${NAME_MAX_LENGTH} characters or fewer.`
  }

  const pickupDate = input.pickupDate ?? ''
  if (!pickupDate || !DATE_PATTERN.test(pickupDate) || Number.isNaN(Date.parse(pickupDate))) {
    errors.pickupDate = 'A valid pickup date is required.'
  } else if (pickupDate < todayAsIsoDate()) {
    errors.pickupDate = 'Pickup date cannot be in the past.'
  }

  if (!isValidQty(input.breadQty)) {
    errors.breadQty = `Bread quantity must be a whole number between 0 and ${QTY_MAX}.`
  }

  if (!isValidQty(input.rollQty)) {
    errors.rollQty = `Roll quantity must be a whole number between 0 and ${QTY_MAX}.`
  }

  if (!errors.breadQty && !errors.rollQty && (input.breadQty ?? 0) === 0 && (input.rollQty ?? 0) === 0) {
    errors.breadQty = 'Order at least one bread or roll.'
    errors.rollQty = 'Order at least one bread or roll.'
  }

  return { valid: Object.keys(errors).length === 0, errors }
}
