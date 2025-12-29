import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { Suspense } from 'react'
import Logo from '@/components/Logo'
import UserMenu from '@/components/UserMenu'

async function getPurchaseDetails(sessionId: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('purchases')
    .select(`
      *,
      events (
        title,
        date,
        location
      )
    `)
    .eq('stripe_session_id', sessionId)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string }
}) {
  const sessionId = searchParams.session_id

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-700 p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Invalid Session</h1>
          <p className="text-gray-400 mb-6">No session ID provided.</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  const purchase = await getPurchaseDetails(sessionId)

  if (!purchase) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-700 p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Processing...</h1>
          <p className="text-gray-400 mb-6">Your payment is being processed. You will receive a confirmation email shortly.</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  const event = purchase.events as any

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 shadow-lg relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <Logo height={50} showTagline />
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-700 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-900/50 border border-green-700 mb-4">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
          <p className="text-gray-400 mb-8">
            Your tickets have been confirmed. A confirmation email has been sent to <strong className="text-white">{purchase.user_email}</strong>
          </p>
          
          <div className="bg-gray-700/50 rounded-lg p-6 mb-6 text-left border border-gray-600">
            <h2 className="text-xl font-bold text-white mb-4">Order Details</h2>
            <div className="space-y-2">
              <p className="text-gray-300"><strong className="text-white">Event:</strong> {event.title}</p>
              <p className="text-gray-300"><strong className="text-white">Date:</strong> {new Date(event.date).toLocaleDateString('en-GB', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
              <p className="text-gray-300"><strong className="text-white">Location:</strong> {event.location}</p>
              <p className="text-gray-300"><strong className="text-white">Quantity:</strong> {purchase.quantity}</p>
              <p className="text-gray-300"><strong className="text-white">Total:</strong> ${purchase.total_price.toFixed(2)}</p>
              <div className="pt-2 border-t border-gray-600">
                <p className="text-sm text-gray-400 mb-1">Confirmation Code</p>
                <p className="text-2xl font-mono font-bold text-pink-400">{purchase.confirmation_code}</p>
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="inline-block px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            Browse More Events
          </Link>
        </div>
      </main>
    </div>
  )
}

