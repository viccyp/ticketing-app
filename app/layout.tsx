import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vic Valentine - Event Ticketing',
  description: 'Buy tickets for amazing events',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  )
}



