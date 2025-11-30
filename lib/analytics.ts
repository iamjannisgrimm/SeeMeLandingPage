import { supabase } from './supabase';

// Generate a unique session ID for this user session
const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

// Get or create a persistent user ID
const getUserId = (): string => {
  if (typeof window === 'undefined') return '';
  
  let userId = localStorage.getItem('analytics_user_id');
  if (!userId) {
    userId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('analytics_user_id', userId);
  }
  return userId;
};

// Detect device type
const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

// Get browser info
const getBrowserInfo = () => {
  if (typeof window === 'undefined') return {};
  
  const ua = navigator.userAgent;
  return {
    user_agent: ua,
    language: navigator.language,
    screen_width: window.screen.width,
    screen_height: window.screen.height,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    device_pixel_ratio: window.devicePixelRatio,
  };
};

export interface AnalyticsEvent {
  event_type: string;
  event_data?: Record<string, any>;
}

// Track an event
export const trackEvent = async (event: AnalyticsEvent) => {
  try {
    const sessionId = getSessionId();
    const userId = getUserId();
    const deviceType = getDeviceType();
    const browserInfo = getBrowserInfo();

    const eventData = {
      user_id: userId,
      session_id: sessionId,
      event_type: event.event_type,
      event_data: {
        ...event.event_data,
        device_type: deviceType,
        ...browserInfo,
        timestamp: new Date().toISOString(),
        page_url: window.location.href,
        referrer: document.referrer,
      },
      created_at: new Date().toISOString(),
    };

    // Send to Supabase
    const { error } = await supabase
      .from('analytics_events')
      .insert([eventData]);

    if (error) {
      console.error('Analytics error:', error);
    }
  } catch (error) {
    console.error('Failed to track event:', error);
  }
};

// Specific tracking functions
export const analytics = {
  // Page view
  pageView: () => trackEvent({ event_type: 'page_view' }),

  // Scroll tracking
  scrollProgress: (percentage: number, section?: number) => 
    trackEvent({ 
      event_type: 'scroll_progress', 
      event_data: { percentage, section } 
    }),

  // Video events
  videoLoaded: (videoId: string, loadTime: number) => 
    trackEvent({ 
      event_type: 'video_loaded', 
      event_data: { video_id: videoId, load_time_ms: loadTime } 
    }),

  videoError: (videoId: string, error: string) => 
    trackEvent({ 
      event_type: 'video_error', 
      event_data: { video_id: videoId, error } 
    }),

  videoPlaying: (videoId: string) => 
    trackEvent({ 
      event_type: 'video_playing', 
      event_data: { video_id: videoId } 
    }),

  // Section visibility
  sectionVisible: (sectionNumber: number, sectionName: string) => 
    trackEvent({ 
      event_type: 'section_visible', 
      event_data: { section_number: sectionNumber, section_name: sectionName } 
    }),

  // User interactions
  buttonClick: (buttonName: string, location: string) => 
    trackEvent({ 
      event_type: 'button_click', 
      event_data: { button_name: buttonName, location } 
    }),

  scrollIndicatorClick: () => 
    trackEvent({ event_type: 'scroll_indicator_click' }),

  // Performance metrics
  pageLoadTime: (loadTime: number) => 
    trackEvent({ 
      event_type: 'page_load_time', 
      event_data: { load_time_ms: loadTime } 
    }),

  // Completion tracking
  reachedEnd: () => 
    trackEvent({ event_type: 'reached_end' }),

  // Session duration (call on page unload)
  sessionEnd: (duration: number) => 
    trackEvent({ 
      event_type: 'session_end', 
      event_data: { duration_seconds: duration } 
    }),

  // Custom event
  custom: (eventName: string, data?: Record<string, any>) => 
    trackEvent({ 
      event_type: eventName, 
      event_data: data 
    }),
};
