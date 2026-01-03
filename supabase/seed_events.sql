-- Seed example music events in London for the next 3 months
-- Note: Run this in Supabase SQL Editor after creating the events table
-- Delete existing events first if needed: DELETE FROM events;

-- Event 1: Marianne Collective Live Show (2 weeks from now)
INSERT INTO events (title, description, date, location, image_url, price, total_tickets, available_tickets)
VALUES (
  'Marianne Collective Live Show',
  'Experience an unforgettable night with Marianne Collective as they perform their latest hits and fan favorites. Join us for an intimate live performance featuring their unique blend of indie rock and soulful melodies. This is a must-see event for music lovers!',
  NOW() + INTERVAL '14 days',
  'The O2 Academy Brixton, London',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
  8.00,
  400,
  400
)
ON CONFLICT DO NOTHING;

-- Event 2: London Music Festival (1 month from now)
INSERT INTO events (title, description, date, location, image_url, price, total_tickets, available_tickets)
VALUES (
  'London Music Festival 2025',
  'A spectacular one-day music festival featuring the best emerging artists from across the UK. Multiple stages, food vendors, and an incredible atmosphere. Don''t miss this celebration of music in the heart of London!',
  NOW() + INTERVAL '30 days',
  'Hyde Park, London',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop',
  25.00,
  5000,
  5000
)
ON CONFLICT DO NOTHING;

-- Event 3: Peach Club Live (1.5 months from now)
INSERT INTO events (title, description, date, location, image_url, price, total_tickets, available_tickets)
VALUES (
  'Peach Club Live',
  'Don''t miss the electrifying feminist punk band from Norwich! Peach Club brings their raw energy and powerful anthems to London for an unforgettable night. Known for their fierce performances and empowering lyrics, this is a show you won''t want to miss. Join us for an evening of punk rock, passion, and pure energy!',
  NOW() + INTERVAL '45 days',
  'The Garage, London',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
  12.00,
  300,
  300
)
ON CONFLICT DO NOTHING;

-- Event 4: Indie Night at The Roundhouse (2.5 months from now)
INSERT INTO events (title, description, date, location, image_url, price, total_tickets, available_tickets)
VALUES (
  'Indie Night: Emerging Artists Showcase',
  'Discover the next big thing in music! This special showcase features five incredible indie artists performing their original music. A perfect evening for discovering new sounds and supporting emerging talent in London''s vibrant music scene.',
  NOW() + INTERVAL '75 days',
  'The Roundhouse, London',
  'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&h=600&fit=crop',
  15.00,
  800,
  800
)
ON CONFLICT DO NOTHING;
