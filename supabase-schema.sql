-- Analytics Events Table
-- Run this SQL in your Supabase SQL Editor to create the analytics table

CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Indexes for common queries
  INDEX idx_user_id (user_id),
  INDEX idx_session_id (session_id),
  INDEX idx_event_type (event_type),
  INDEX idx_created_at (created_at DESC)
);

-- Enable Row Level Security (RLS)
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Policy to allow anonymous inserts (for tracking)
CREATE POLICY "Allow anonymous inserts" ON analytics_events
  FOR INSERT
  WITH CHECK (true);

-- Policy to allow authenticated users to read their own data
CREATE POLICY "Users can read own data" ON analytics_events
  FOR SELECT
  USING (auth.uid()::text = user_id OR auth.role() = 'service_role');

-- Optional: Create a view for easy analytics queries
CREATE OR REPLACE VIEW analytics_summary AS
SELECT 
  event_type,
  COUNT(*) as event_count,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT session_id) as unique_sessions,
  DATE_TRUNC('day', created_at) as date
FROM analytics_events
GROUP BY event_type, DATE_TRUNC('day', created_at)
ORDER BY date DESC, event_count DESC;

-- Grant access to the view
GRANT SELECT ON analytics_summary TO authenticated, anon;

COMMENT ON TABLE analytics_events IS 'Stores all user analytics events from the landing page';
COMMENT ON COLUMN analytics_events.user_id IS 'Persistent user ID stored in localStorage';
COMMENT ON COLUMN analytics_events.session_id IS 'Session ID stored in sessionStorage';
COMMENT ON COLUMN analytics_events.event_type IS 'Type of event (e.g., page_view, scroll_progress, video_loaded)';
COMMENT ON COLUMN analytics_events.event_data IS 'Additional event data in JSON format';
