'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Event } from '@/lib/db.types'
import EventSearch from './EventSearch'

interface EventsListProps {
  initialEvents: Event[]
}

export default function EventsList({ initialEvents }: EventsListProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents)

  return (
    <>
      <EventSearch events={initialEvents} onSearch={setEvents} />
      
      {events.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold text-gray-300 mb-4">No events found</h2>
          <p className="text-gray-500">Try adjusting your search terms</p>
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
    </>
  )
}

