# Custom Analytics Setup Guide

This project includes a comprehensive custom analytics system that tracks detailed user behavior and sends data to your Supabase database.

## What Gets Tracked

### Automatic Tracking
- **Page Views**: Every time a user loads the page
- **Page Load Time**: How long it takes for the page to load
- **Scroll Progress**: Tracked at every 10% milestone (10%, 20%, 30%, etc.)
- **Section Visibility**: When each section becomes active
- **Session Duration**: How long users spend on the page
- **Reached End**: When users scroll to 95%+ of the page
- **Tab Visibility**: When users switch tabs or return

### Video Tracking
- **Video Loaded**: When each video successfully loads (with load time in ms)
- **Video Error**: If a video fails to load (with error details)
- **Video Playing**: When a video starts playing

### User Interactions
- **Scroll Indicator Click**: When users click the scroll chevron
- **Button Clicks**: Any CTA or button interactions (easily extensible)

### Device & Browser Info (Captured with Every Event)
- Device type (mobile/tablet/desktop)
- Screen resolution
- Viewport size
- Device pixel ratio
- User agent
- Browser language
- Page URL
- Referrer
- Timestamp

## Setup Instructions

### 1. Set Up Supabase

1. Go to [Supabase](https://supabase.com) and create a new project (or use existing)
2. Go to the SQL Editor in your Supabase dashboard
3. Copy and paste the contents of `supabase-schema.sql` into the SQL editor
4. Run the SQL to create the `analytics_events` table

### 2. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Get your Supabase credentials:
   - Go to your Supabase project settings
   - Navigate to API settings
   - Copy your Project URL and anon/public key

3. Update `.env.local` with your credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 3. Deploy

That's it! The analytics are already integrated into the app. Just deploy and data will start flowing to your Supabase database.

## Viewing Your Analytics Data

### In Supabase Dashboard

1. Go to your Supabase project
2. Click on "Table Editor"
3. Select the `analytics_events` table
4. You'll see all events with their data

### Using SQL Queries

You can run custom queries in the SQL Editor. Here are some useful examples:

#### Total Events by Type
```sql
SELECT 
  event_type, 
  COUNT(*) as count
FROM analytics_events
GROUP BY event_type
ORDER BY count DESC;
```

#### Unique Users and Sessions
```sql
SELECT 
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT session_id) as unique_sessions
FROM analytics_events;
```

#### Scroll Completion Rate
```sql
SELECT 
  COUNT(DISTINCT user_id) FILTER (WHERE event_type = 'reached_end') * 100.0 / 
  COUNT(DISTINCT user_id) FILTER (WHERE event_type = 'page_view') as completion_rate
FROM analytics_events;
```

#### Average Session Duration
```sql
SELECT 
  AVG((event_data->>'duration_seconds')::numeric) as avg_duration_seconds
FROM analytics_events
WHERE event_type = 'session_end';
```

#### Video Load Performance
```sql
SELECT 
  event_data->>'video_id' as video,
  AVG((event_data->>'load_time_ms')::numeric) as avg_load_time_ms,
  COUNT(*) as loads
FROM analytics_events
WHERE event_type = 'video_loaded'
GROUP BY event_data->>'video_id';
```

#### Device Breakdown
```sql
SELECT 
  event_data->>'device_type' as device,
  COUNT(DISTINCT user_id) as users
FROM analytics_events
WHERE event_type = 'page_view'
GROUP BY event_data->>'device_type';
```

#### Section Engagement
```sql
SELECT 
  event_data->>'section_name' as section,
  COUNT(DISTINCT user_id) as unique_viewers
FROM analytics_events
WHERE event_type = 'section_visible'
GROUP BY event_data->>'section_name'
ORDER BY (event_data->>'section_number')::int;
```

#### Hourly Traffic
```sql
SELECT 
  DATE_TRUNC('hour', created_at) as hour,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(*) as total_events
FROM analytics_events
GROUP BY hour
ORDER BY hour DESC;
```

## Adding Custom Events

You can easily add custom tracking anywhere in your app:

```typescript
import { analytics } from '@/lib/analytics';

// Track a custom event
analytics.custom('custom_event_name', {
  key: 'value',
  another_key: 123
});

// Track a button click
analytics.buttonClick('Download App', 'Hero Section');
```

## Privacy & GDPR Compliance

- No personally identifiable information (PII) is collected
- User IDs are randomly generated, not tied to real identities
- All data is stored in your own Supabase database
- You have full control over data retention and deletion
- Users are anonymous by default

## Performance Impact

The analytics system is designed to be lightweight:
- Events are sent asynchronously (non-blocking)
- Failed events don't break the user experience
- Minimal bundle size impact (~5KB gzipped)
- No third-party tracking scripts

## Troubleshooting

### Events not showing up in Supabase?

1. Check your `.env.local` file has correct credentials
2. Verify the `analytics_events` table exists in Supabase
3. Check browser console for any errors
4. Make sure RLS policies are set correctly (run the schema SQL again)

### Want to disable analytics temporarily?

Comment out this line in `FinalLanding.tsx`:
```typescript
// const analytics = useAnalytics();
```

## Cost Considerations

Supabase free tier includes:
- 500MB database space
- 2GB bandwidth
- 50,000 monthly active users

For a landing page, this should be more than enough. Each event is typically < 1KB.
