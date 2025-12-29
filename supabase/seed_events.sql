-- Insert 3 example events
-- Run this in Supabase SQL Editor after running the main schema

-- Insert 3 example events
-- Run this in Supabase SQL Editor after running the main schema

INSERT INTO events (title, description, date, location, price, total_tickets, available_tickets, image_url) VALUES
(
  'Summer Music Festival 2025',
  'Join us for an unforgettable summer music festival featuring top artists from around the world. Experience live performances, food trucks, and an amazing atmosphere. This is a must-attend event for music lovers!',
  '2025-07-15 18:00:00+00',
  'Central Park, New York, NY',
  75.00,
  500,
  500,
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800'
),
(
  'Tech Conference 2025',
  'A premier technology conference bringing together industry leaders, developers, and innovators. Featuring keynote speakers, workshops, and networking opportunities. Learn about the latest trends in AI, web development, and cloud computing.',
  '2025-08-20 09:00:00+00',
  'Moscone Center, San Francisco, CA',
  299.00,
  1000,
  1000,
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'
),
(
  'Comedy Night Special',
  'An evening of laughter with top comedians from around the country. Perfect for a night out with friends or a date night. Drinks and snacks available. Get ready to laugh until your sides hurt!',
  '2025-06-10 20:00:00+00',
  'The Comedy Club, Los Angeles, CA',
  35.00,
  200,
  200,
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800'
)
ON CONFLICT DO NOTHING;

