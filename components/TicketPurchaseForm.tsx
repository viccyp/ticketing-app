'use client'

import { useState, useEffect } from 'react'
import { Event } from '@/lib/db.types'
import { createClient } from '@/lib/supabase/client'

interface TicketPurchaseFormProps {
  event: Event
}

export default function TicketPurchaseForm({ event }: TicketPurchaseFormProps) {
  const [quantity, setQuantity] = useState(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Pre-fill email and name if user is logged in
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        if (user.email) {
          setEmail(user.email)
        }
        
        // Get user profile for name
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()
        
        if (profile?.full_name) {
          setName(profile.full_name)
        }
      }
    })
  }, [])

  const totalPrice = quantity * event.price
  const maxTickets = Math.min(event.available_tickets, 10) // Limit to 10 tickets per purchase

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: event.id,
          quantity,
          name,
          email,
        }),
      })

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        throw new Error(`Server error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Purchase Tickets</h2>
        <div className="flex items-center justify-between mb-4">
          <label htmlFor="quantity" className="text-gray-300 font-medium">
            Quantity
          </label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-10 h-10 rounded-full border border-gray-600 bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              -
            </button>
            <input
              type="number"
              id="quantity"
              min="1"
              max={maxTickets}
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1
                setQuantity(Math.min(Math.max(1, val), maxTickets))
              }}
              className="w-20 text-center bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2"
            />
            <button
              type="button"
              onClick={() => setQuantity(Math.min(maxTickets, quantity + 1))}
              disabled={quantity >= maxTickets}
              className="w-10 h-10 rounded-full border border-gray-600 bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              +
            </button>
          </div>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-4 mb-6 border border-gray-600">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Total</span>
            <span className="text-3xl font-bold text-pink-400">£{totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent placeholder-gray-500"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent placeholder-gray-500"
            placeholder="john@example.com"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {event.available_tickets === 0 ? (
        <button
          type="button"
          disabled
          className="w-full px-6 py-3 bg-gray-700 text-gray-500 rounded-lg cursor-not-allowed"
        >
          Sold Out
        </button>
      ) : (
        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {loading ? 'Processing...' : `Purchase ${quantity} Ticket${quantity > 1 ? 's' : ''}`}
        </button>
      )}
    </form>
  )
}



