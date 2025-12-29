import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'

async function getUserPurchases(userId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('purchases')
    .select(`
      *,
      events (
        id,
        title,
        date,
        location,
        image_url
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching purchases:', error)
    return []
  }

  return data || []
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const purchases = await getUserPurchases(user.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                Vic Valentine
              </Link>
              <p className="text-gray-400 mt-1">My Tickets</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">{user.email}</span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {purchases.length === 0 ? (
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-700 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No tickets yet</h2>
            <p className="text-gray-400 mb-6">You haven't purchased any tickets yet.</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">My Tickets</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchases.map((purchase: any) => {
                const event = purchase.events
                return (
                  <div key={purchase.id} className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-gray-700 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                    {event?.image_url && (
                      <div className="h-48 bg-gray-700 overflow-hidden">
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="w-full h-full object-cover opacity-90"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2">{event?.title || 'Event'}</h3>
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-400">
                          <strong className="text-gray-300">Date:</strong> {event?.date ? new Date(event.date).toLocaleDateString('en-GB', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'TBA'}
                        </p>
                        <p className="text-sm text-gray-400">
                          <strong className="text-gray-300">Location:</strong> {event?.location || 'TBA'}
                        </p>
                        <p className="text-sm text-gray-400">
                          <strong className="text-gray-300">Quantity:</strong> {purchase.quantity}
                        </p>
                        <p className="text-sm text-gray-400">
                          <strong className="text-gray-300">Total:</strong> ${purchase.total_price.toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-gray-700/50 rounded-lg p-3 mb-4 border border-gray-600">
                        <p className="text-xs text-gray-400 mb-1">Confirmation Code</p>
                        <p className="text-lg font-mono font-bold text-pink-400">{purchase.confirmation_code}</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        Purchased: {new Date(purchase.created_at).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

