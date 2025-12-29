'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function UserMenu() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return null
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="text-sm text-gray-300 hover:text-pink-400 transition-colors"
        >
          My Tickets
        </Link>
        <span className="text-sm text-gray-600">|</span>
        <span className="text-sm text-gray-400">{user.email}</span>
      </div>
    )
  }

  return (
    <Link
      href="/login"
      className="px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
    >
      Sign In
    </Link>
  )
}

