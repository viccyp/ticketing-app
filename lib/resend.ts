import { Resend } from 'resend'

export function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set. Please add it to your .env.local file.')
  }

  return new Resend(apiKey)
}

// Export instance for convenience
export const resend = getResend()



