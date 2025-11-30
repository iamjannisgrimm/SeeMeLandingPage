import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function GET(request: NextRequest) {
  // Verify authentication
  const authToken = request.cookies.get('analytics_auth')?.value || 
                   request.headers.get('x-analytics-auth');
  
  if (authToken !== process.env.ANALYTICS_DASHBOARD_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 404 });
  }

  try {
    // Use service role key to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch all analytics data
    const { data: events, error } = await supabase
      .from('analytics_events')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Calculate metrics
    const metrics = calculateMetrics(events || []);

    return NextResponse.json({
      events: events || [],
      metrics,
      success: true
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}

function calculateMetrics(events: any[]) {
  const uniqueUsers = new Set(events.map(e => e.user_id)).size;
  const uniqueSessions = new Set(events.map(e => e.session_id)).size;
  
  const pageViews = events.filter(e => e.event_type === 'page_view').length;
  const reachedEnd = events.filter(e => e.event_type === 'reached_end').length;
  const completionRate = pageViews > 0 ? (reachedEnd / pageViews) * 100 : 0;
  
  const sessionEnds = events.filter(e => e.event_type === 'session_end');
  const avgSessionDuration = sessionEnds.length > 0
    ? sessionEnds.reduce((acc, e) => acc + (e.event_data?.duration_seconds || 0), 0) / sessionEnds.length
    : 0;
  
  const videoLoads = events.filter(e => e.event_type === 'video_loaded');
  const avgVideoLoadTime = videoLoads.length > 0
    ? videoLoads.reduce((acc, e) => acc + (e.event_data?.load_time_ms || 0), 0) / videoLoads.length
    : 0;
  
  const videoErrors = events.filter(e => e.event_type === 'video_error').length;
  const videoErrorRate = videoLoads.length > 0 ? (videoErrors / videoLoads.length) * 100 : 0;
  
  // Device breakdown
  const deviceCounts = events.reduce((acc: any, e) => {
    const device = e.event_data?.device_type || 'unknown';
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {});
  
  // Event type breakdown
  const eventTypeCounts = events.reduce((acc: any, e) => {
    acc[e.event_type] = (acc[e.event_type] || 0) + 1;
    return acc;
  }, {});
  
  // Section engagement
  const sectionViews = events
    .filter(e => e.event_type === 'section_visible')
    .reduce((acc: any, e) => {
      const section = e.event_data?.section_name || 'unknown';
      acc[section] = (acc[section] || 0) + 1;
      return acc;
    }, {});
  
  // Hourly traffic
  const hourlyTraffic = events.reduce((acc: any, e) => {
    const hour = new Date(e.created_at).toISOString().slice(0, 13);
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {});

  const ctaClicks = events
    .filter(e => e.event_type === 'button_click')
    .reduce((acc: any, e) => {
      const name = e.event_data?.button_name || 'Unknown CTA';
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});

  const totalCtaClicks = Object.values(ctaClicks).reduce(
    (sum: number, v: any) => sum + (typeof v === 'number' ? v : 0),
    0
  );
  
  return {
    uniqueUsers,
    uniqueSessions,
    pageViews,
    completionRate: Math.round(completionRate * 10) / 10,
    avgSessionDuration: Math.round(avgSessionDuration),
    avgVideoLoadTime: Math.round(avgVideoLoadTime),
    videoErrorRate: Math.round(videoErrorRate * 10) / 10,
    deviceCounts,
    eventTypeCounts,
    sectionViews,
    hourlyTraffic,
    ctaClicks,
    totalCtaClicks,
  };
}
