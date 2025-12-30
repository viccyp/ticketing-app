# Switching to Live Stripe Payments

Follow these steps to switch from test mode to live/production Stripe payments.

## ⚠️ Important Notes

- **Live payments are REAL** - you'll be charged real money
- Make sure your app is fully tested before switching
- Keep your test keys for development
- Never commit live keys to git

## Step 1: Get Your Live Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. **Toggle to "Live mode"** (switch in the top right)
3. Go to **Developers** → **API keys**
4. Copy your **Live Secret Key** (starts with `sk_live_`)
5. Keep this secure - you'll need it for production

## Step 2: Set Up Production Webhook

1. In Stripe Dashboard (Live mode), go to **Developers** → **Webhooks**
2. Click **"Add endpoint"**
3. Enter your production webhook URL:
   ```
   https://www.vicvalentine.com/api/webhooks/stripe
   ```
4. Select the event: **`checkout.session.completed`**
5. Click **"Add endpoint"**
6. Copy the **Signing secret** (starts with `whsec_`) - this is your live webhook secret

## Step 3: Update Environment Variables

### For Local Development (Optional - keep test keys)

Keep using test keys in `.env.local` for local development:
```env
STRIPE_SECRET_KEY=sk_test_your_test_key
STRIPE_WEBHOOK_SECRET=whsec_your_test_webhook_secret
```

### For Production (Vercel)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Update or add these variables:

```env
STRIPE_SECRET_KEY=sk_live_your_live_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret_here
```

4. Make sure these are set for **Production** environment
5. **Redeploy** your application after updating

## Step 4: Verify Your Setup

1. **Test in production:**
   - Go to your live site: https://www.vicvalentine.com
   - Try purchasing a ticket with a real card (small amount)
   - Verify payment appears in Stripe Dashboard → Payments (Live mode)

2. **Check webhook:**
   - Go to Stripe Dashboard → Webhooks
   - Click on your production webhook endpoint
   - Check "Recent events" - you should see `checkout.session.completed` events
   - Verify they're successful (green checkmark)

3. **Verify email confirmation:**
   - After a successful payment, check that confirmation emails are sent
   - Check Resend dashboard for email logs

## Step 5: Test Cards (for testing in live mode)

⚠️ **Warning:** In live mode, these test cards will charge real money!

For testing in live mode, Stripe provides test cards that work:
- Use your own card for small test amounts
- Or use Stripe's test mode for development

**Recommended:** Keep using test mode for development, only use live mode in production.

## Step 6: Monitor Your Payments

1. **Stripe Dashboard:**
   - Monitor payments in real-time
   - Set up email notifications for successful payments
   - Review any failed payments

2. **Webhook Logs:**
   - Check webhook delivery status
   - Review any failed webhook attempts
   - Check your server logs for errors

## Troubleshooting

### Payment succeeds but no confirmation email
- Check webhook is receiving events (Stripe Dashboard → Webhooks)
- Verify `STRIPE_WEBHOOK_SECRET` matches the live webhook secret
- Check Vercel function logs for errors
- Verify Resend API key is correct

### Webhook not receiving events
- Verify webhook URL is correct: `https://www.vicvalentine.com/api/webhooks/stripe`
- Check webhook is active in Stripe Dashboard
- Verify `STRIPE_WEBHOOK_SECRET` is set correctly in Vercel
- Check Vercel function logs

### "Invalid API Key" error
- Make sure you're using `sk_live_` key (not `sk_test_`)
- Verify no extra spaces or quotes in environment variables
- Redeploy after updating environment variables

## Security Best Practices

1. ✅ Never commit live keys to git
2. ✅ Use environment variables (already set up)
3. ✅ Rotate keys if compromised
4. ✅ Monitor for suspicious activity
5. ✅ Set up Stripe email notifications
6. ✅ Review failed payments regularly

## Next Steps

After switching to live payments:
- Monitor your first few transactions closely
- Set up Stripe email notifications
- Consider setting up Stripe Radar for fraud detection
- Review your payment flow regularly

