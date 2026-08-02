export interface Order {
  firstName: string
  lastName: string
  pickupDate: string
  breadQty: number
  rollQty: number
}

export type OrderErrors = Partial<Record<keyof Order, string>>
