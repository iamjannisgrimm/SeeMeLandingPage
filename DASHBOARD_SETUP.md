# Analytics Dashboard Setup Guide

## Overview

The analytics dashboard is a **completely separate, secure interface** for viewing your landing page analytics. It's protected by token authentication and is not accessible or discoverable from the main landing page.

## Security Features

✅ **Hidden Route**: Dashboard is at `/analytics-dashboard` - not linked anywhere on the main site  
✅ **Token Authentication**: Requires a secret token to access  
✅ **404 on Unauthorized**: Returns 404 (not 401) to hide the route's existence  
✅ **Middleware Protection**: Server-side authentication before any page loads  
✅ **Service Role Key**: API uses Supabase service role to bypass RLS  
✅ **No Client Exposure**: Dashboard code is not included in main landing page bundle  

## Setup Instructions

### 1. Generate a Secure Access Token

Run this command to generate a secure random token:

```bash
openssl rand -base64 32
```

Copy the output (it will look like: `xK9mP2vN8qR5tL3wY7zB4cF6hJ1dG0sA8eT9uI2oP5m=`)

### 2. Get Your Supabase Service Role Key

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/saeqeimqodkugwyxumpt/settings/api
2. Scroll down to "Project API keys"
3. Copy the **service_role** key (NOT the anon key)
4. ⚠️ **IMPORTANT**: This key has full database access - keep it secret!

### 3. Update Your .env.local File

Open `.env.local` and update these two values:

```bash
ANALYTICS_DASHBOARD_TOKEN=paste-your-generated-token-here
SUPABASE_SERVICE_ROLE_KEY=paste-your-service-role-key-here
```

### 4. Restart Your Dev Server

```bash
pnpm dev
```

### 5. Access the Dashboard

1. Go to: http://localhost:3000/analytics-dashboard/login
2. Enter your `ANALYTICS_DASHBOARD_TOKEN` value
3. Click "Access Dashboard"

You'll be redirected to the main dashboard at `/analytics-dashboard`

## Dashboard Features

### 📊 Key Metrics
- **Unique Users**: Total unique visitors
- **Page Views**: Total page loads
- **Completion Rate**: % of users who scrolled to the end
- **Avg Session Duration**: How long users stay on the page

### 📈 Performance Metrics
- **Avg Video Load Time**: Video loading performance
- **Video Error Rate**: % of failed video loads
- **Total Sessions**: Number of browsing sessions

### 📉 Visualizations

1. **Device Breakdown** (Pie Chart)
   - Shows mobile vs tablet vs desktop traffic

2. **Top Events** (Bar Chart)
   - Most common user actions
   - Helps identify what users interact with most

3. **Section Engagement** (Horizontal Bar Chart)
   - Which sections users view most
   - Helps identify drop-off points

4. **Traffic Over Time** (Line Chart)
   - Hourly traffic patterns
   - Identify peak usage times

5. **Recent Events Table**
   - Live feed of user actions
   - See real-time activity

### 🔍 Time Range Filter

Use the dropdown in the top-right to view data for:
- Last 24 hours
- Last 7 days (default)
- Last 30 days
- Last 90 days

## Security Best Practices

### ✅ DO:
- Keep your `ANALYTICS_DASHBOARD_TOKEN` secret
- Keep your `SUPABASE_SERVICE_ROLE_KEY` secret
- Use a strong, random token (32+ characters)
- Change the token periodically
- Only share the token with trusted team members
- Add `.env.local` to `.gitignore` (already done)

### ❌ DON'T:
- Commit `.env.local` to git
- Share your service role key publicly
- Use a simple/guessable token
- Link to the dashboard from your main site
- Expose the dashboard URL publicly

## Deployment (Production)

When deploying to Vercel/production:

1. Add environment variables in your hosting platform:
   - `ANALYTICS_DASHBOARD_TOKEN`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. Access the dashboard at:
   - `https://yourdomain.com/analytics-dashboard/login`

3. The dashboard will NOT be discoverable:
   - No links from main site
   - Returns 404 without valid token
   - Not in sitemap
   - Not indexed by search engines

## Troubleshooting

### "Invalid access token" error
- Check that `ANALYTICS_DASHBOARD_TOKEN` is set in `.env.local`
- Make sure you're entering the exact token value
- Restart your dev server after changing `.env.local`

### "Failed to load analytics data"
- Check that `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Verify the service role key is from the correct Supabase project
- Check browser console for specific error messages

### Dashboard shows no data
- Make sure analytics events are being tracked (check Supabase table)
- Try selecting a longer time range (e.g., 30 days)
- Verify the `analytics_events` table exists in Supabase

### Can't access dashboard at all (404)
- Verify middleware is working: check `middleware.ts` exists
- Make sure you're accessing `/analytics-dashboard/login` first
- Check that the auth cookie is being set (browser dev tools → Application → Cookies)

## Understanding the Data

### Completion Rate
- **High (>70%)**: Users are engaged and scrolling through content
- **Medium (40-70%)**: Some drop-off, consider optimizing content
- **Low (<40%)**: Significant drop-off, review content strategy

### Video Load Time
- **Good (<1000ms)**: Fast loading, good user experience
- **Okay (1000-3000ms)**: Acceptable, but could be optimized
- **Poor (>3000ms)**: Slow loading, may cause user drop-off

### Session Duration
- **Short (<30s)**: Users bouncing quickly
- **Medium (30-120s)**: Normal browsing
- **Long (>120s)**: High engagement

### Section Engagement
- Shows which sections users actually see
- Use this to identify where users drop off
- Optimize or reorder sections based on engagement

## Advanced: Custom Queries

You can run custom SQL queries in Supabase for deeper insights:

```sql
-- Users who completed the full journey
SELECT COUNT(DISTINCT user_id) 
FROM analytics_events 
WHERE event_type = 'reached_end';

-- Average scroll depth
SELECT AVG((event_data->>'percentage')::numeric) 
FROM analytics_events 
WHERE event_type = 'scroll_progress';

-- Most common user paths
SELECT 
  user_id,
  array_agg(event_type ORDER BY created_at) as user_journey
FROM analytics_events
GROUP BY user_id
LIMIT 10;
```

## Support

For issues or questions, check:
1. Browser console for errors
2. Supabase logs for API errors
3. Network tab for failed requests
4. This guide's troubleshooting section
