'use client';

import { useEffect, useRef } from 'react';
import { analytics } from '@/lib/analytics';

export const useAnalytics = () => {
  const sessionStartTime = useRef<number>(Date.now());
  const lastScrollPercentage = useRef<number>(0);
  const maxScrollPercentage = useRef<number>(0);
  const hasReachedEnd = useRef<boolean>(false);

  useEffect(() => {
    // Track page view
    analytics.pageView();

    // Track page load time
    if (typeof window !== 'undefined' && window.performance) {
      const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
      if (loadTime > 0) {
        analytics.pageLoadTime(loadTime);
      }
    }

    // Track scroll progress
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercentage = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);

      // Track if user reached the end (95%+) - fire only once per session
      if (!hasReachedEnd.current && scrollPercentage >= 95) {
        hasReachedEnd.current = true;
        analytics.reachedEnd();
      }

      // Update max scroll
      if (scrollPercentage > maxScrollPercentage.current) {
        maxScrollPercentage.current = scrollPercentage;
      }

      // Track every 10% milestone
      const milestone = Math.floor(scrollPercentage / 10) * 10;
      const lastMilestone = Math.floor(lastScrollPercentage.current / 10) * 10;

      if (milestone !== lastMilestone && milestone > 0) {
        analytics.scrollProgress(milestone);
      }

      lastScrollPercentage.current = scrollPercentage;
    };

    // Track session end on page unload
    const handleBeforeUnload = () => {
      const sessionDuration = Math.round((Date.now() - sessionStartTime.current) / 1000);
      analytics.sessionEnd(sessionDuration);
    };

    // Track visibility change (tab switching)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        analytics.custom('tab_hidden', { 
          scroll_percentage: lastScrollPercentage.current,
          max_scroll: maxScrollPercentage.current 
        });
      } else {
        analytics.custom('tab_visible', { 
          scroll_percentage: lastScrollPercentage.current 
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return analytics;
};
