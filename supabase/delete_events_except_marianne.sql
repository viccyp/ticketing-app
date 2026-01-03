-- Delete all events except "Marianne Collective Live Show"
-- Run this in Supabase SQL Editor

DELETE FROM events
WHERE title != 'Marianne Collective Live Show';

-- Verify the deletion (optional - uncomment to check)
-- SELECT * FROM events;

