export interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
  image_url?: string
  price: number
  total_tickets: number
  available_tickets: number
  created_at: string
  updated_at: string
}

export interface Ticket {
  id: string
  event_id: string
  user_id: string
  quantity: number
  total_price: number
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface Purchase {
  id: string
  ticket_id: string
  event_id: string
  user_id: string
  user_email: string
  user_name: string
  quantity: number
  total_price: number
  confirmation_code: string
  created_at: string
}



