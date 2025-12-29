'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import LogoutButton from './LogoutButton'

export default function UserMenu() {
  const [user, setUser] = useState<any>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    let mounted = true
    let timeoutId: NodeJS.Timeout
    let subscription: { unsubscribe: () => void } | null = null
    
    const init = async () => {
      try {
        const supabase = createClient()
        
        // Set timeout to prevent infinite loading (longer timeout)
        timeoutId = setTimeout(() => {
          if (mounted) {
            console.warn('UserMenu timeout - showing sign in')
            setLoading(false)
          }
        }, 5000)
        
        // Get initial session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (!mounted) return
        
        if (sessionError) {
          console.error('Session error:', sessionError)
        }
        
        // Set user from session
        if (session?.user) {
          setUser(session.user)
          
          // Fetch profile
          try {
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('full_name')
              .eq('id', session.user.id)
              .single()
            
            if (mounted) {
              setUserName(profile?.full_name || null)
            }
          } catch (err) {
            console.error('Profile fetch error:', err)
          }
        } else {
          setUser(null)
        }
        
        clearTimeout(timeoutId)
        
        if (mounted) {
          setLoading(false)
        }
        
        // Listen for auth changes
        const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          if (!mounted) return
          
          setUser(newSession?.user ?? null)
          
          if (newSession?.user) {
            try {
              const { data: profile } = await supabase
                .from('user_profiles')
                .select('full_name')
                .eq('id', newSession.user.id)
                .single()
              
              if (mounted) {
                setUserName(profile?.full_name || null)
              }
            } catch (err) {
              console.error('Profile fetch error on auth change:', err)
            }
          } else {
            setUserName(null)
          }
        })
        
        subscription = authSubscription
      } catch (err) {
        console.error('UserMenu init error:', err)
        clearTimeout(timeoutId)
        if (mounted) {
          setLoading(false)
        }
      }
    }
    
    init()
    
    return () => {
      mounted = false
      if (timeoutId) clearTimeout(timeoutId)
      if (subscription) subscription.unsubscribe()
    }
  }, [])

  // Show loading state briefly
  if (loading) {
    return (
      <div className="px-4 py-2">
        <div className="w-16 h-6 bg-gray-700 rounded animate-pulse"></div>
      </div>
    )
  }

  // Show user menu if logged in
  if (user) {
    const displayName = userName || user.email?.split('@')[0] || 'User'
    
    return (
      <div className="relative z-[60]">
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm text-gray-300 hover:text-pink-400 transition-colors"
          >
            My Tickets
          </Link>
          <span className="text-sm text-gray-600">|</span>
          <Link
            href="/account"
            className="text-sm text-gray-300 hover:text-pink-400 transition-colors"
          >
            Account
          </Link>
          <span className="text-sm text-gray-600">|</span>
          <LogoutButton />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex items-center gap-2 text-gray-300 hover:text-pink-400 transition-colors px-2 py-1"
          aria-label="Menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl md:hidden z-[60]">
            <div className="py-2">
              <div className="px-4 py-2 border-b border-gray-700">
                <p className="text-sm font-medium text-white">{displayName}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-pink-400 transition-colors"
              >
                My Tickets
              </Link>
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-pink-400 transition-colors"
              >
                Account
              </Link>
              <div className="px-4 py-2 border-t border-gray-700 mt-2">
                <div className="flex justify-center">
                  <LogoutButton />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Show sign in button if not logged in
  return (
    <Link
      href="/login"
      className="px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
    >
      Sign In
    </Link>
  )
}
