import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Event } from '@/lib/db.types'
import UserMenu from '@/components/UserMenu'

async function getEvents(): Promise<Event[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching events:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error creating Supabase client:', error)
    return []
  }
}

export default async function Home() {
  const events = await getEvents()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                Vic Valentine
              </h1>
              <p className="text-gray-400 mt-2">Your premier event ticketing platform</p>
            </div>
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {events.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-300 mb-4">No events available</h2>
            <p className="text-gray-500">Check back soon for exciting events!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-gray-700"
              >
                {event.image_url && (
                  <div className="h-48 bg-gray-700 overflow-hidden">
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover opacity-90"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">{new Date(event.date).toLocaleDateString('en-GB')}</p>
                      <p className="text-sm text-gray-400">{event.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-pink-400">${event.price}</p>
                      <p className="text-xs text-gray-500">
                        {event.available_tickets} tickets left
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}



