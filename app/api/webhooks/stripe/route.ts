import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import { getResend } from '@/lib/resend'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  console.log('=== WEBHOOK RECEIVED ===')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    )
  }

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')
  console.log('Webhook signature present:', !!signature)

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    console.log('Webhook event type:', event.type)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    console.log('Received checkout.session.completed event')
    const session = event.data.object as Stripe.Checkout.Session
    console.log('Session ID:', session.id)
    console.log('Session metadata:', session.metadata)

    try {
      const supabase = createAdminClient()
      const { event_id, quantity, user_name, user_email, user_id } = session.metadata || {}
      console.log('Extracted metadata:', { event_id, quantity, user_name, user_email, user_id })

      if (!event_id || !quantity || !user_name || !user_email) {
        console.error('Missing metadata in Stripe session')
        console.error('Available metadata keys:', Object.keys(session.metadata || {}))
        console.error('Full session object:', JSON.stringify(session, null, 2))
        return NextResponse.json({ received: true })
      }
      
      console.log('All metadata present, proceeding with purchase processing...')

      // Get event details
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', event_id)
        .single()

      if (eventError || !event) {
        console.error('Event not found:', eventError)
        return NextResponse.json({ received: true })
      }

      // Check if tickets are still available
      if (event.available_tickets < parseInt(quantity)) {
        console.error('Not enough tickets available')
        return NextResponse.json({ received: true })
      }

      // Generate confirmation code
      const confirmationCode = Math.random().toString(36).substring(2, 10).toUpperCase()

      // Create ticket purchase record
      const { data: ticket, error: ticketError } = await supabase
        .from('tickets')
        .insert({
          event_id,
          user_id: user_id || null,
          quantity: parseInt(quantity),
          total_price: event.price * parseInt(quantity),
          status: 'confirmed',
        })
        .select()
        .single()

      if (ticketError || !ticket) {
        console.error('Error creating ticket:', ticketError)
        return NextResponse.json({ received: true })
      }

      // Create purchase record
      const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          ticket_id: ticket.id,
          event_id,
          user_id: user_id || null,
          user_email,
          user_name,
          quantity: parseInt(quantity),
          total_price: event.price * parseInt(quantity),
          confirmation_code: confirmationCode,
          stripe_session_id: session.id,
          stripe_payment_intent_id: session.payment_intent as string || null,
        })
        .select()
        .single()

      if (purchaseError || !purchase) {
        console.error('Error creating purchase:', purchaseError)
        // Rollback ticket creation
        await supabase.from('tickets').delete().eq('id', ticket.id)
        return NextResponse.json({ received: true })
      }

      // Update event available tickets
      const { error: updateError } = await supabase
        .from('events')
        .update({ available_tickets: event.available_tickets - parseInt(quantity) })
        .eq('id', event_id)

      if (updateError) {
        console.error('Error updating event:', updateError)
        // Rollback both ticket and purchase
        await supabase.from('purchases').delete().eq('id', purchase.id)
        await supabase.from('tickets').delete().eq('id', ticket.id)
        return NextResponse.json({ received: true })
      }

      console.log('✅ All database operations successful, proceeding to send email...')
      console.log('Purchase created with ID:', purchase.id)
      console.log('Confirmation code:', confirmationCode)

      // Send confirmation email
      try {
        console.log('📧 Attempting to send confirmation email to:', user_email)
        const resend = getResend()
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@vicvalentine.com'
        console.log('Sending email from:', fromEmail)
        
        const emailResult = await resend.emails.send({
          from: fromEmail,
          to: user_email,
          subject: `Ticket Confirmation - ${event.title}`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                  <h1 style="color: white; margin: 0; font-size: 28px;">Vic Valentine</h1>
                </div>
                <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
                  <h2 style="color: #111827; margin-top: 0;">Ticket Confirmation</h2>
                  <p>Hi ${user_name},</p>
                  <p>Thank you for your purchase! Your tickets for <strong>${event.title}</strong> have been confirmed.</p>
                  
                  <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ec4899;">
                    <p style="margin: 5px 0;"><strong>Event:</strong> ${event.title}</p>
                    <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(event.date).toLocaleDateString('en-GB', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                    <p style="margin: 5px 0;"><strong>Location:</strong> ${event.location}</p>
                    <p style="margin: 5px 0;"><strong>Quantity:</strong> ${quantity}</p>
                    <p style="margin: 5px 0;"><strong>Total Price:</strong> £${(event.price * parseInt(quantity)).toFixed(2)}</p>
                    <p style="margin: 5px 0;"><strong>Confirmation Code:</strong> <span style="font-family: monospace; font-size: 18px; font-weight: bold; color: #ec4899;">${confirmationCode}</span></p>
                  </div>
                  
                  <p>Please save this confirmation code and bring it with you to the event.</p>
                  <p>We look forward to seeing you there!</p>
                  <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
                    Best regards,<br>
                    The Vic Valentine Team
                  </p>
                </div>
              </body>
            </html>
          `,
        })
        console.log('✅ Email sent successfully!')
        console.log('Email result:', JSON.stringify(emailResult, null, 2))
      } catch (emailError) {
        console.error('❌ Error sending email:', emailError)
        if (emailError instanceof Error) {
          console.error('Error message:', emailError.message)
          console.error('Error stack:', emailError.stack)
        } else {
          console.error('Full error object:', JSON.stringify(emailError, null, 2))
        }
        // Don't fail the webhook if email fails, but log it clearly
        console.error('⚠️ Email failed but webhook will still return success')
      }

      console.log('✅ Webhook processing complete')
      return NextResponse.json({ received: true })
    } catch (error) {
      console.error('Error processing webhook:', error)
      return NextResponse.json({ received: true })
    }
  }

  return NextResponse.json({ received: true })
}

