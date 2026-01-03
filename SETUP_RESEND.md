# Resend Email Setup Guide

Follow these steps to set up Resend for sending confirmation emails.

## Step 1: Create a Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Click **"Sign Up"** or **"Get Started"**
3. Sign up with your email or GitHub account
4. Verify your email address if prompted

## Step 2: Get Your API Key

1. Once logged in, you'll be taken to the dashboard
2. Click on **"API Keys"** in the left sidebar
3. Click **"Create API Key"**
4. Give it a name (e.g., "Vic Valentine Production" or "Vic Valentine Development")
5. Select the permissions (you need "Send emails" permission)
6. Click **"Add"**
7. **Copy the API key immediately** - you won't be able to see it again!

## Step 3: Set Up Your Sending Domain (Optional but Recommended)

For production, you should verify your own domain:

1. Go to **"Domains"** in the left sidebar
2. Click **"Add Domain"**
3. Enter your domain (e.g., `vicvalentine.com`)
4. Follow the DNS setup instructions to verify your domain
5. Once verified, you can use emails like `noreply@vicvalentine.com`

### For Testing/Development

Resend provides a default sending domain for testing:
- You can use `onboarding@resend.dev` for testing
- This is perfect for development and testing
- No domain verification needed

## Step 4: Add to Environment Variables

Add these to your `.env.local` file:

```env
# Resend Configuration
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev
```

**For production**, use your verified domain:
```env
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

## Step 5: Test the Email

1. Make sure your Stripe webhook is set up and working
2. Purchase a test ticket
3. Complete the payment
4. Check the email inbox you used for the purchase
5. You should receive a confirmation email with:
   - Event details
   - Confirmation code
   - Purchase information

## Email Template

The confirmation email includes:
- ✅ Event name and details
- ✅ Date and time (British format)
- ✅ Location
- ✅ Number of tickets
- ✅ Total price
- ✅ Unique confirmation code
- ✅ Beautiful gradient design matching your brand

## Troubleshooting

### "RESEND_API_KEY is not set" error
- Make sure you've added `RESEND_API_KEY` to your `.env.local`
- Restart your dev server after adding it
- Check for typos in the variable name

### Emails not being sent
- Check your server logs for email errors
- Verify your API key is correct
- Make sure the webhook is being triggered (check Stripe Dashboard → Webhooks → Recent events)
- Check your Resend dashboard for any errors or rate limits

### "Domain not verified" error
- For testing, use `onboarding@resend.dev`
- For production, verify your domain in Resend dashboard
- Make sure DNS records are set up correctly

### Email going to spam
- Verify your domain with Resend
- Set up SPF and DKIM records (Resend provides instructions)
- Use a proper "from" email address
- Avoid spam trigger words in subject/content

## Resend Limits

**Free Tier:**
- 3,000 emails per month
- 100 emails per day
- Perfect for development and small projects

**Paid Plans:**
- Start at $20/month
- Higher limits available
- Better deliverability

## Next Steps

Once set up:
1. Test with a real purchase
2. Check email deliverability
3. Customize the email template if needed (in `app/api/webhooks/stripe/route.ts`)
4. Set up your production domain for better deliverability

## Support

- Resend Docs: [https://resend.com/docs](https://resend.com/docs)
- Resend Support: support@resend.com




