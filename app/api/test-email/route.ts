import { NextRequest, NextResponse } from 'next/server'
import { getResend } from '@/lib/resend'

export async function GET(request: NextRequest) {
  try {
    const resend = getResend()
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
    const testEmail = request.nextUrl.searchParams.get('to') || 'test@example.com'

    console.log('Testing email send...')
    console.log('From:', fromEmail)
    console.log('To:', testEmail)

    const result = await resend.emails.send({
      from: fromEmail,
      to: testEmail,
      subject: 'Test Email from Vic Valentine',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
          </head>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h1>Test Email</h1>
            <p>If you're reading this, Resend is working correctly!</p>
            <p>This is a test email from your Vic Valentine ticketing app.</p>
          </body>
        </html>
      `,
    })

    console.log('Email sent successfully:', result)

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      result,
    })
  } catch (error) {
    console.error('Error sending test email:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorDetails = error instanceof Error ? error.stack : String(error)

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: errorDetails,
      },
      { status: 500 }
    )
  }
}

