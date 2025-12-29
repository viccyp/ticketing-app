# Deploying to Vercel

## Step 1: Push to GitHub

1. **Create a new repository on GitHub:**
   - Go to [github.com](https://github.com) and sign in
   - Click the "+" icon in the top right → "New repository"
   - Name it: `vic-valentine` (or your preferred name)
   - Make it **Public** or **Private** (your choice)
   - **Don't** initialize with README, .gitignore, or license (we already have these)
   - Click "Create repository"

2. **Push your code to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/vic-valentine.git
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` with your GitHub username.

## Step 2: Deploy to Vercel

1. **Go to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import your project:**
   - Click "Add New..." → "Project"
   - Select your `vic-valentine` repository
   - Click "Import"

3. **Configure environment variables:**
   Before deploying, add all your environment variables in Vercel:
   
   Go to **Settings** → **Environment Variables** and add:
   
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   STRIPE_SECRET_KEY=sk_live_your_live_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   RESEND_API_KEY=re_your_resend_key
   RESEND_FROM_EMAIL=your_verified_email@domain.com
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```
   
   **Important:**
   - Use **live** Stripe keys for production (not test keys)
   - Use your production Resend email (verified domain)
   - Update `NEXT_PUBLIC_APP_URL` after first deployment

4. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `https://your-app.vercel.app`

## Step 3: Set Up Stripe Webhook for Production

1. **In Stripe Dashboard:**
   - Go to **Developers** → **Webhooks**
   - Click "Add endpoint"
   - Enter your Vercel URL: `https://your-app.vercel.app/api/webhooks/stripe`
   - Select event: `checkout.session.completed`
   - Click "Add endpoint"
   - Copy the **Signing secret** (starts with `whsec_`)
   - Add it to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

2. **Update Vercel environment variables:**
   - Go back to Vercel → Settings → Environment Variables
   - Update `STRIPE_WEBHOOK_SECRET` with the production webhook secret
   - Redeploy your app

## Step 4: Update Database Schema (if needed)

Make sure your Supabase database has all the latest schema updates:
- Run `supabase/schema.sql` if you haven't already
- Run `supabase/schema_update.sql` to add Stripe columns

## Step 5: Test Your Deployment

1. Visit your Vercel URL
2. Test purchasing a ticket
3. Verify emails are being sent
4. Check that webhooks are working in Stripe Dashboard

## Troubleshooting

**Build fails:**
- Check that all environment variables are set
- Verify your package.json has all dependencies
- Check the build logs in Vercel

**Webhooks not working:**
- Verify the webhook URL is correct in Stripe
- Check that `STRIPE_WEBHOOK_SECRET` matches the signing secret
- Look at Vercel function logs for errors

**Emails not sending:**
- Verify `RESEND_API_KEY` is correct
- Check that `RESEND_FROM_EMAIL` is a verified domain
- Look at server logs for email errors

## Next Steps

After deployment:
- Set up a custom domain (optional)
- Configure analytics
- Set up monitoring and error tracking
- Consider adding a staging environment

