'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface AccountFormProps {
  user: any
  initialProfile: any
}

export default function AccountForm({ user, initialProfile }: AccountFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Form fields
  const [fullName, setFullName] = useState(initialProfile?.full_name || '')
  const [phone, setPhone] = useState(initialProfile?.phone || '')
  const [dateOfBirth, setDateOfBirth] = useState(initialProfile?.date_of_birth || '')
  const [addressLine1, setAddressLine1] = useState(initialProfile?.address_line1 || '')
  const [addressLine2, setAddressLine2] = useState(initialProfile?.address_line2 || '')
  const [city, setCity] = useState(initialProfile?.city || '')
  const [postalCode, setPostalCode] = useState(initialProfile?.postal_code || '')
  const [country, setCountry] = useState(initialProfile?.country || '')
  const [emailNotifications, setEmailNotifications] = useState(initialProfile?.email_notifications ?? true)
  const [smsNotifications, setSmsNotifications] = useState(initialProfile?.sms_notifications ?? false)
  
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = createClient()

      // Update or insert user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          full_name: fullName,
          phone: phone || null,
          date_of_birth: dateOfBirth || null,
          address_line1: addressLine1 || null,
          address_line2: addressLine2 || null,
          city: city || null,
          postal_code: postalCode || null,
          country: country || null,
          email_notifications: emailNotifications,
          sms_notifications: smsNotifications,
        })

      if (profileError) throw profileError

      setSuccess(true)
      setIsEditing(false)
      router.refresh()
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    // Reset to initial values
    setFullName(initialProfile?.full_name || '')
    setPhone(initialProfile?.phone || '')
    setDateOfBirth(initialProfile?.date_of_birth || '')
    setAddressLine1(initialProfile?.address_line1 || '')
    setAddressLine2(initialProfile?.address_line2 || '')
    setCity(initialProfile?.city || '')
    setPostalCode(initialProfile?.postal_code || '')
    setCountry(initialProfile?.country || '')
    setEmailNotifications(initialProfile?.email_notifications ?? true)
    setSmsNotifications(initialProfile?.sms_notifications ?? false)
    setIsEditing(false)
    setError(null)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString('en-GB')
  }

  return (
    <div className="space-y-8">
      {/* Account Information Section (Read-only) */}
      <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
        <h2 className="text-xl font-semibold text-white mb-4">Account Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
            <p className="text-white">{user.email}</p>
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Account Created</label>
            <p className="text-white">{new Date(user.created_at).toLocaleDateString('en-GB', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
          </div>
          {initialProfile?.updated_at && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Last Updated</label>
              <p className="text-white">{new Date(initialProfile.updated_at).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
          )}
        </div>
      </div>

      {/* Personal Information Section */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Personal Information</h2>
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name *
              </label>
              {isEditing ? (
                <input
                  type="text"
                  id="fullName"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              ) : (
                <p className="text-white py-2">{fullName || 'Not set'}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="+44 7700 900000"
                />
              ) : (
                <p className="text-white py-2">{phone || 'Not set'}</p>
              )}
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-300 mb-2">
                Date of Birth
              </label>
              {isEditing ? (
                <input
                  type="date"
                  id="dateOfBirth"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              ) : (
                <p className="text-white py-2">{formatDate(dateOfBirth)}</p>
              )}
            </div>
          </div>
        </div>

        {/* Address Information Section */}
        <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
          <h2 className="text-xl font-semibold text-white mb-4">Address Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-300 mb-2">
                Address Line 1
              </label>
              {isEditing ? (
                <input
                  type="text"
                  id="addressLine1"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Street address"
                />
              ) : (
                <p className="text-white py-2">{addressLine1 || 'Not set'}</p>
              )}
            </div>

            <div>
              <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-300 mb-2">
                Address Line 2
              </label>
              {isEditing ? (
                <input
                  type="text"
                  id="addressLine2"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Apartment, suite, etc. (optional)"
                />
              ) : (
                <p className="text-white py-2">{addressLine2 || 'Not set'}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-2">
                  City
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="City"
                  />
                ) : (
                  <p className="text-white py-2">{city || 'Not set'}</p>
                )}
              </div>

              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-300 mb-2">
                  Postal Code
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    id="postalCode"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Postal code"
                  />
                ) : (
                  <p className="text-white py-2">{postalCode || 'Not set'}</p>
                )}
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-2">
                  Country
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Country"
                  />
                ) : (
                  <p className="text-white py-2">{country || 'Not set'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Notification Preferences Section */}
        <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
          <h2 className="text-xl font-semibold text-white mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="emailNotifications" className="block text-sm font-medium text-gray-300 mb-1">
                  Email Notifications
                </label>
                <p className="text-xs text-gray-400">Receive updates about your tickets and events via email</p>
              </div>
              {isEditing ? (
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                </label>
              ) : (
                <span className={`px-3 py-1 rounded-full text-sm ${emailNotifications ? 'bg-green-900/50 text-green-300' : 'bg-gray-700 text-gray-400'}`}>
                  {emailNotifications ? 'Enabled' : 'Disabled'}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="smsNotifications" className="block text-sm font-medium text-gray-300 mb-1">
                  SMS Notifications
                </label>
                <p className="text-xs text-gray-400">Receive text message updates about your tickets</p>
              </div>
              {isEditing ? (
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="smsNotifications"
                    checked={smsNotifications}
                    onChange={(e) => setSmsNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                </label>
              ) : (
                <span className={`px-3 py-1 rounded-full text-sm ${smsNotifications ? 'bg-green-900/50 text-green-300' : 'bg-gray-700 text-gray-400'}`}>
                  {smsNotifications ? 'Enabled' : 'Disabled'}
                </span>
              )}
            </div>
          </div>
        </div>

        {success && (
          <div className="bg-green-900/50 border border-green-700 rounded-lg p-4">
            <p className="text-green-300 text-sm">Profile updated successfully!</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-4">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {isEditing && (
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  )
}
