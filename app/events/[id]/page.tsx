import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import TicketPurchaseForm from '@/components/TicketPurchaseForm'
import UserMenu from '@/components/UserMenu'
import Logo from '@/components/Logo'

async function getEvent(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export default async function EventPage({ params }: { params: { id: string } }) {
  const event = await getEvent(params.id)

  if (!event) {
    notFound()
  }

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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden border border-gray-700">
          {event.image_url && (
            <div className="h-64 bg-gray-700 overflow-hidden">
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-full object-cover opacity-90"
              />
            </div>
          )}
          <div className="p-8">
            <h1 className="text-4xl font-bold text-white mb-4">{event.title}</h1>
            <div className="flex items-center gap-6 mb-6 text-gray-400">
              <div>
                <p className="font-semibold text-gray-300">Date</p>
                <p>{new Date(event.date).toLocaleDateString('en-GB', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-300">Location</p>
                <p>{event.location}</p>
              </div>
            </div>
            <div className="prose max-w-none mb-8">
              <p className="text-gray-300 whitespace-pre-line">{event.description}</p>
            </div>
            <div className="border-t border-gray-700 pt-8">
              <TicketPurchaseForm event={event} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}



