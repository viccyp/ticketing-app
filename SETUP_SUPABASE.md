# Supabase Setup Guide

Follow these steps to set up your Supabase database for Vic Valentine.

## Step 1: Create a Supabase Account and Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign in"** if you already have an account
3. Sign up or log in with GitHub, Google, or email
4. Once logged in, click **"New Project"**
5. Fill in the project details:
   - **Name**: Choose a name (e.g., "vic-valentine")
   - **Database Password**: Create a strong password (save this somewhere safe!)
   - **Region**: Choose the region closest to you
   - **Pricing Plan**: Free tier is fine for development
6. Click **"Create new project"**
7. Wait 2-3 minutes for your project to be provisioned

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, click on the **Settings** icon (gear icon) in the left sidebar
2. Click **"API"** in the settings menu
3. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (a long string starting with `eyJ...`)
4. Also get your **service_role** key:
   - Scroll down to the **"Project API keys"** section
   - Find the **"service_role"** key (⚠️ Keep this secret! Never expose it in client-side code)
   - Click the eye icon to reveal it, then copy it

## Step 3: Run the Database Schema

1. In your Supabase dashboard, click on **"SQL Editor"** in the left sidebar
2. Click **"New query"** button
3. Open the file `supabase/schema.sql` from this project
4. Copy **ALL** the contents of that file
5. Paste it into the SQL Editor in Supabase
6. Click **"Run"** (or press `Cmd+Enter` / `Ctrl+Enter`)
7. You should see a success message: "Success. No rows returned"

## Step 4: Verify Tables Were Created

1. Click on **"Table Editor"** in the left sidebar
2. You should see three tables:
   - `events`
   - `tickets`
   - `purchases`
3. If you see all three, you're good to go! ✅

## Step 5: (Optional) Add Sample Events

1. Go back to **"SQL Editor"**
2. Click **"New query"**
3. Open the file `supabase/seed.sql` from this project
4. Copy and paste the contents into the SQL Editor
5. Click **"Run"**
6. Go back to **"Table Editor"** → **"events"** to see your sample events

## Step 6: Add Keys to Your Environment Variables

1. Create a file called `.env.local` in your project root (if it doesn't exist)
2. Add these variables with your actual values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

Replace:
- `your-project-id` with your actual project ID from the URL
- `your-anon-key-here` with your anon public key
- `your-service-role-key-here` with your service_role key

## Troubleshooting

### "relation already exists" error
If you see this error when running the schema, it means the tables already exist. You can either:
- Delete the existing tables from Table Editor and run the schema again, OR
- Modify the schema to use `DROP TABLE IF EXISTS` before creating tables

### Can't find service_role key
- Make sure you're in Settings → API
- Scroll down to the "Project API keys" section
- The service_role key is hidden by default - click the eye icon to reveal it

### Tables not showing up
- Make sure you ran the entire schema.sql file
- Check the SQL Editor for any error messages
- Try refreshing the Table Editor page

## Next Steps

Once Supabase is set up, continue with:
- Step 3: Set up Resend (for email confirmations)
- Step 4: Configure environment variables
- Step 5: Run `npm run dev` to start your app!






