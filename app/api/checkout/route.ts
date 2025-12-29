import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'
import { z } from 'zod'

const checkoutSchema = z.object({
  event_id: z.string().uuid(),
  quantity: z.number().int().min(1).max(10),
  name: z.string().min(1),
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event_id, quantity, name, email } = checkoutSchema.parse(body)

    // Get user if logged in
    const supabaseServer = await createClient()
    const { data: { user } } = await supabaseServer.auth.getUser()
    const userId = user?.id || null

    const supabase = createAdminClient()

    // Get event details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', event_id)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Check if enough tickets are available
    if (event.available_tickets < quantity) {
      return NextResponse.json(
        { error: 'Not enough tickets available' },
        { status: 400 }
      )
    }

    const totalPrice = event.price * quantity
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Initialize Stripe
    const stripe = getStripe()

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: `${event.title} - ${quantity} Ticket${quantity > 1 ? 's' : ''}`,
              description: `Event: ${event.title}\nDate: ${new Date(event.date).toLocaleDateString('en-GB')}\nLocation: ${event.location}`,
              images: event.image_url ? [event.image_url] : undefined,
            },
            unit_amount: Math.round(event.price * 100), // Convert to cents
          },
          quantity: quantity,
        },
      ],
      mode: 'payment',
      customer_email: email,
      metadata: {
        event_id: event.id,
        quantity: quantity.toString(),
        user_name: name,
        user_email: email,
        user_id: userId || '',
      },
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/events/${event.id}?canceled=true`,
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

