# Stripe Setup Guide

Follow these steps to set up Stripe payment processing for Vic Valentine.

## Step 1: Create a Stripe Account

1. Go to [https://stripe.com](https://stripe.com)
2. Click **"Sign in"** or **"Start now"** to create an account
3. Complete the account setup process

## Step 2: Get Your API Keys

1. In your Stripe Dashboard, click on **"Developers"** in the left sidebar
2. Click **"API keys"**
3. You'll see two keys:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)
4. Copy your **Secret key** (you'll need this for `STRIPE_SECRET_KEY`)
5. For testing, use the **Test mode** keys (they have `_test_` in them)

## Step 3: Set Up Webhook Endpoint

1. In Stripe Dashboard, go to **"Developers"** → **"Webhooks"**
2. Click **"Add endpoint"**
3. For local development, you'll need to use Stripe CLI (see below) or deploy to a public URL
4. For production, enter your webhook URL: `https://yourdomain.com/api/webhooks/stripe`
5. Select the event to listen for: **`checkout.session.completed`**
6. Click **"Add endpoint"**
7. Copy the **"Signing secret"** (starts with `whsec_`) - you'll need this for `STRIPE_WEBHOOK_SECRET`

## Step 4: Local Development with Stripe CLI

For local development, you need to use Stripe CLI to forward webhooks to your local server:

1. Install Stripe CLI:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Or download from: https://stripe.com/docs/stripe-cli
   ```

2. Login to Stripe CLI:
   ```bash
   stripe login
   ```

3. Forward webhooks to your local server (run this in a separate terminal):
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. Copy the webhook signing secret that appears (starts with `whsec_`)
5. Add it to your `.env.local` as `STRIPE_WEBHOOK_SECRET`

## Step 5: Add Stripe Keys to Environment Variables

Add these to your `.env.local` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

**Important:** 
- Use test keys (`sk_test_` and `whsec_`) for development
- Never commit these keys to git (they're already in `.gitignore`)

## Step 6: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Start Stripe webhook forwarding (in another terminal):
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

3. Go to your website and try purchasing a ticket
4. Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any ZIP code

## Step 7: Update Database Schema

Run the schema update to add Stripe fields:

1. In Supabase Dashboard → **SQL Editor**
2. Open `supabase/schema_update.sql` from your project
3. Copy and paste the SQL
4. Click **"Run"**

## Step 8: Add Sample Events

1. In Supabase Dashboard → **SQL Editor**
2. Open `supabase/seed_events.sql` from your project
3. Copy and paste the SQL
4. Click **"Run"**
5. Verify events appear in **Table Editor** → **events**

## Production Deployment

When deploying to production:

1. Switch to **Live mode** in Stripe Dashboard
2. Get your live API keys
3. Update environment variables with live keys
4. Set up the webhook endpoint with your production URL
5. Update `NEXT_PUBLIC_APP_URL` to your production domain

## Troubleshooting

### Webhook not receiving events
- Make sure Stripe CLI is running and forwarding to the correct URL
- Check that `STRIPE_WEBHOOK_SECRET` matches the signing secret from Stripe
- Verify the webhook endpoint is active in Stripe Dashboard

### Payment succeeds but no email sent
- Check that `RESEND_API_KEY` is set correctly
- Check server logs for email errors
- Verify the webhook is being received (check Stripe Dashboard → Webhooks → Recent events)

### "Invalid API Key" error
- Make sure you're using the correct key (test vs live)
- Verify there are no extra spaces or quotes in `.env.local`
- Restart your dev server after updating environment variables

