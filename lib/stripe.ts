import Stripe from 'stripe'

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY
  
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not set. Please add it to your .env.local file.')
  }

  return new Stripe(secretKey, {
    apiVersion: '2024-11-20.acacia',
    typescript: true,
  })
}

