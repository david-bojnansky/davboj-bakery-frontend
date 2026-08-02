import { randomUUID } from 'node:crypto'
import { validateOrder } from '../../shared/utils/validateOrder'
import type { Order } from '../../shared/types/order'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<Order>>(event)
  const { valid, errors } = validateOrder(body)

  if (!valid) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid order', data: errors })
  }

  const order = {
    id: randomUUID(),
    firstName: body.firstName!.trim(),
    lastName: body.lastName!.trim(),
    pickupDate: body.pickupDate!,
    breadQty: Number(body.breadQty),
    rollQty: Number(body.rollQty),
    createdAt: new Date().toISOString()
  }

  const container = getOrdersContainer()
  await container.items.create(order)

  return {
    success: true,
    message: `Thanks ${order.firstName}, your order is confirmed for pickup on ${order.pickupDate}.`,
    order
  }
})
