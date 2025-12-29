# Vic Valentine - Event Ticketing Platform

A modern event ticketing website built with Next.js, Supabase, and Resend.

## Features

- 🎫 Browse and purchase event tickets
- 💳 Stripe Checkout integration for secure payments
- 📧 Automatic confirmation emails via Resend
- 🔐 Secure database with Supabase
- 📱 Responsive design

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database & Auth**: Supabase
- **Payments**: Stripe
- **Email**: Resend
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the SQL from `supabase/schema.sql`
3. Get your project URL and anon key from Settings > API

### 3. Set Up Stripe

See [SETUP_STRIPE.md](./SETUP_STRIPE.md) for detailed instructions.

Quick setup:
1. Create an account at [stripe.com](https://stripe.com)
2. Get your API keys from Developers → API keys
3. Set up webhook endpoint (use Stripe CLI for local development)
4. Get your webhook signing secret

### 4. Set Up Resend

1. Create an account at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Verify your sending domain (or use the default)

### 5. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Resend Configuration
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# App Configuration
NEXT_PUBLIC_APP_URL=https://vicvalentine.com
```

### 6. Update Database Schema

Run the schema update to add Stripe fields:

1. In Supabase SQL Editor, run `supabase/schema_update.sql`
2. This adds `stripe_session_id` and `stripe_payment_intent_id` columns

### 7. Add Sample Events

1. In Supabase SQL Editor, run `supabase/seed_events.sql`
2. This adds 3 example events to your database

### 8. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses three main tables:

- **events**: Stores event information (title, date, location, price, tickets)
- **tickets**: Tracks ticket purchases
- **purchases**: Stores purchase details and confirmation codes for email sending

## Adding Events

You can add events directly through the Supabase dashboard or create an admin interface. Events require:
- Title
- Description
- Date (timestamp)
- Location
- Price
- Total tickets available

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── checkout/     # Stripe checkout session creation
│   │   └── webhooks/
│   │       └── stripe/    # Stripe webhook handler
│   ├── events/[id]/      # Event detail page
│   ├── success/          # Payment success page
│   └── page.tsx          # Home page with event listings
├── components/
│   └── TicketPurchaseForm.tsx  # Ticket purchase form
├── lib/
│   ├── supabase/         # Supabase client configurations
│   ├── resend.ts         # Resend email client
│   └── db.types.ts       # TypeScript types
└── supabase/
    └── schema.sql        # Database schema
```

## Features in Detail

### Ticket Purchase Flow

1. User browses events on the home page
2. Clicks on an event to view details
3. Selects quantity and enters name/email
4. Clicks "Purchase Tickets" → redirected to Stripe Checkout
5. Completes payment on Stripe
6. Redirected to success page
7. Receives confirmation email with confirmation code

### Email Confirmation

When a purchase is made, the system:
- Generates a unique confirmation code
- Sends a beautifully formatted email via Resend
- Includes all event and purchase details

## Security

- Row Level Security (RLS) enabled on all tables
- Public read access to events
- Secure purchase processing with validation
- Service role key used only server-side

## License

MIT



