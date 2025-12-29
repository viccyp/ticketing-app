import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { resend } from '@/lib/resend'
import { z } from 'zod'

const purchaseSchema = z.object({
  event_id: z.string().uuid(),
  quantity: z.number().int().min(1).max(10),
  name: z.string().min(1),
  email: z.string().email(),
})

function generateConfirmationCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event_id, quantity, name, email } = purchaseSchema.parse(body)

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

    // Generate confirmation code
    const confirmationCode = generateConfirmationCode()

    // Create ticket purchase record
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .insert({
        event_id,
        user_id: null, // Anonymous purchase
        quantity,
        total_price: event.price * quantity,
        status: 'confirmed',
      })
      .select()
      .single()

    if (ticketError || !ticket) {
      console.error('Error creating ticket:', ticketError)
      return NextResponse.json(
        { error: 'Failed to create ticket purchase' },
        { status: 500 }
      )
    }

    // Create purchase record
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        ticket_id: ticket.id,
        event_id,
        user_id: null,
        user_email: email,
        user_name: name,
        quantity,
        total_price: event.price * quantity,
        confirmation_code: confirmationCode,
      })
      .select()
      .single()

    if (purchaseError || !purchase) {
      console.error('Error creating purchase:', purchaseError)
      // Rollback ticket creation
      await supabase.from('tickets').delete().eq('id', ticket.id)
      return NextResponse.json(
        { error: 'Failed to process purchase' },
        { status: 500 }
      )
    }

    // Update event available tickets
    const { error: updateError } = await supabase
      .from('events')
      .update({ available_tickets: event.available_tickets - quantity })
      .eq('id', event_id)

    if (updateError) {
      console.error('Error updating event:', updateError)
      // Rollback both ticket and purchase
      await supabase.from('purchases').delete().eq('id', purchase.id)
      await supabase.from('tickets').delete().eq('id', ticket.id)
      return NextResponse.json(
        { error: 'Failed to update event availability' },
        { status: 500 }
      )
    }

    // Send confirmation email
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@vicvalentine.com',
        to: email,
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
                <p>Hi ${name},</p>
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
                  <p style="margin: 5px 0;"><strong>Total Price:</strong> £${(event.price * quantity).toFixed(2)}</p>
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
    } catch (emailError) {
      console.error('Error sending email:', emailError)
      // Don't fail the purchase if email fails, just log it
    }

    return NextResponse.json({
      success: true,
      confirmation_code: confirmationCode,
      purchase_id: purchase.id,
    })
  } catch (error) {
    console.error('Purchase error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



