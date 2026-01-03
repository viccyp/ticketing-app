# Quick Guide: Adding Example Events

## Step-by-Step Instructions

1. **Open Supabase Dashboard**
   - Go to [https://supabase.com](https://supabase.com)
   - Sign in and select your project

2. **Open SQL Editor**
   - Click on **"SQL Editor"** in the left sidebar
   - Click **"New query"** button

3. **Copy and Paste the SQL**
   - Open the file `supabase/seed_events.sql` from your project
   - Copy **ALL** the contents
   - Paste it into the SQL Editor in Supabase

4. **Run the Query**
   - Click the **"Run"** button (or press `Cmd+Enter` / `Ctrl+Enter`)
   - You should see: "Success. No rows returned" or "INSERT 0 3"

5. **Verify Events Were Added**
   - Click on **"Table Editor"** in the left sidebar
   - Click on the **"events"** table
   - You should see 3 events:
     - Summer Music Festival 2025
     - Tech Conference 2025
     - Comedy Night Special

## What You'll See

After adding the events, when you visit your website at `http://localhost:3000`, you'll see:
- 3 event cards on the home page
- Each event shows title, date, location, price, and available tickets
- Clicking on an event takes you to the detail page where you can purchase tickets

## Troubleshooting

**"relation 'events' does not exist"**
- Make sure you've run the main `schema.sql` file first
- Go back and run `supabase/schema.sql` in the SQL Editor

**Events not showing on website**
- Make sure your `.env.local` has the correct Supabase credentials
- Restart your dev server: `npm run dev`
- Check the browser console for any errors

**"duplicate key value violates unique constraint"**
- The events already exist in your database
- This is fine - the `ON CONFLICT DO NOTHING` clause prevents errors
- You can delete existing events from Table Editor if you want to re-add them




