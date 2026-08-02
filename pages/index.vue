<script setup lang="ts">
import type { Order, OrderErrors } from '../shared/types/order'

const form = reactive<Order>({
  firstName: '',
  lastName: '',
  pickupDate: '',
  breadQty: 0,
  rollQty: 0
})

const errors = ref<OrderErrors>({})
const status = ref<'idle' | 'submitting' | 'success' | 'error'>('idle')
const confirmationMessage = ref('')

async function submitOrder() {
  status.value = 'submitting'
  errors.value = {}

  try {
    const response = await $fetch('/api/orders', {
      method: 'POST',
      body: form
    })

    confirmationMessage.value = response.message
    status.value = 'success'

    form.firstName = ''
    form.lastName = ''
    form.pickupDate = ''
    form.breadQty = 0
    form.rollQty = 0
  // eslint-disable-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    errors.value = error?.data?.data ?? {}
    status.value = 'error'
  }
}
</script>

<template>
  <main class="page">
    <header class="header">
      <h1>DavBoj Bakery</h1>
      <p>Order fresh bread and rolls for pickup.</p>
    </header>

    <form class="order-form" @submit.prevent="submitOrder">
      <div class="field">
        <label for="firstName">First name</label>
        <input id="firstName" v-model="form.firstName" type="text" required>
        <p v-if="errors.firstName" class="error">{{ errors.firstName }}</p>
      </div>

      <div class="field">
        <label for="lastName">Last name</label>
        <input id="lastName" v-model="form.lastName" type="text" required>
        <p v-if="errors.lastName" class="error">{{ errors.lastName }}</p>
      </div>

      <div class="field">
        <label for="pickupDate">Pickup date</label>
        <input id="pickupDate" v-model="form.pickupDate" type="date" required>
        <p v-if="errors.pickupDate" class="error">{{ errors.pickupDate }}</p>
      </div>

      <div class="field">
        <label for="breadQty">Bread (loaves)</label>
        <input id="breadQty" v-model.number="form.breadQty" type="number" min="0" max="100">
        <p v-if="errors.breadQty" class="error">{{ errors.breadQty }}</p>
      </div>

      <div class="field">
        <label for="rollQty">Rolls</label>
        <input id="rollQty" v-model.number="form.rollQty" type="number" min="0" max="100">
        <p v-if="errors.rollQty" class="error">{{ errors.rollQty }}</p>
      </div>

      <button type="submit" :disabled="status === 'submitting'">
        {{ status === 'submitting' ? 'Placing order...' : 'Place order' }}
      </button>

      <p v-if="status === 'success'" class="success">{{ confirmationMessage }}</p>
      <p v-if="status === 'error' && Object.keys(errors).length === 0" class="error">
        Something went wrong placing your order. Please try again.
      </p>
    </form>
  </main>
</template>

<style scoped>
.page {
  max-width: 32rem;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: system-ui, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.order-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

label {
  font-weight: 600;
}

input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  font-size: 1rem;
}

button {
  padding: 0.75rem;
  border: none;
  border-radius: 0.375rem;
  background-color: #8a5a2b;
  color: white;
  font-size: 1rem;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #b91c1c;
  margin: 0;
  font-size: 0.875rem;
}

.success {
  color: #15803d;
  font-weight: 600;
}
</style>
