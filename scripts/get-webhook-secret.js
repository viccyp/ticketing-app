/**
 * Script to list your Stripe webhooks
 * Note: Webhook secrets are only shown ONCE when you create the webhook
 * If you lost the secret, you'll need to create a new webhook endpoint
 */

const Stripe = require('stripe')

// Get your live secret key from environment variable
const stripeSecretKey = process.env.STRIPE_SECRET_KEY

if (!stripeSecretKey) {
  console.error('❌ Error: STRIPE_SECRET_KEY environment variable is not set')
  console.error('   Please set it before running this script:')
  console.error('   export STRIPE_SECRET_KEY=sk_live_...')
  process.exit(1)
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
})

async function listWebhooks() {
  try {
    console.log('🔍 Fetching your Stripe webhooks...\n')
    
    const webhooks = await stripe.webhookEndpoints.list({
      limit: 100,
    })

    if (webhooks.data.length === 0) {
      console.log('❌ No webhooks found. Create one in Stripe Dashboard first.')
      return
    }

    console.log(`✅ Found ${webhooks.data.length} webhook(s):\n`)

    webhooks.data.forEach((webhook, index) => {
      console.log(`${index + 1}. Webhook ID: ${webhook.id}`)
      console.log(`   URL: ${webhook.url}`)
      console.log(`   Status: ${webhook.status}`)
      console.log(`   Created: ${new Date(webhook.created * 1000).toLocaleString()}`)
      console.log(`   Events: ${webhook.enabled_events.join(', ')}`)
      console.log(`   ⚠️  Secret: NOT SHOWN (only displayed once when created)`)
      console.log('')
    })

    console.log('📝 To get the webhook secret:')
    console.log('   1. Go to https://dashboard.stripe.com/webhooks')
    console.log('   2. Click on the webhook endpoint')
    console.log('   3. Click "Reveal" next to "Signing secret"')
    console.log('   4. If you can\'t see it, you\'ll need to create a new webhook')
    console.log('')

  } catch (error) {
    console.error('❌ Error:', error.message)
    if (error.type === 'StripeAuthenticationError') {
      console.error('   Make sure your STRIPE_SECRET_KEY is correct')
    }
  }
}

listWebhooks()




