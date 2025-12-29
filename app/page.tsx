import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Event } from '@/lib/db.types'
import UserMenu from '@/components/UserMenu'
import EventSearch from '@/components/EventSearch'
import EventsList from '@/components/EventsList'
import Logo from '@/components/Logo'

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
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 shadow-lg relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <Logo height={50} showTagline />
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
          <EventsList initialEvents={events} />
        )}
      </main>
    </div>
  )
}
