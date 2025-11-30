'use client';

import { create, StateCreator } from 'zustand';

interface AnalyticsMetrics {
  uniqueUsers: number;
  uniqueSessions: number;
  pageViews: number;
  completionRate: number;
  avgSessionDuration: number;
  avgVideoLoadTime: number;
  videoErrorRate: number;
  deviceCounts: Record<string, number>;
  eventTypeCounts: Record<string, number>;
  sectionViews: Record<string, number>;
  hourlyTraffic: Record<string, number>;
  ctaClicks: Record<string, number>;
  totalCtaClicks: number;
}

export interface AnalyticsData {
  events: any[];
  metrics: AnalyticsMetrics;
}

interface DashboardState {
  data: AnalyticsData | null;
  loading: boolean;
  error: string;
  days: number;
  autoRefresh: boolean;
  lastUpdated?: string;
  fetchAnalytics: () => Promise<void>;
  setDays: (days: number) => void;
  setAutoRefresh: (value: boolean) => void;
}

const dashboardStore: StateCreator<DashboardState> = (set, get) => ({
  data: null,
  loading: false,
  error: '',
  days: 7,
  autoRefresh: true,
  lastUpdated: undefined,

  fetchAnalytics: async () => {
    const { days } = get();
    try {
      set({ loading: true });
      const response = await fetch(`/api/analytics?days=${days}`, { cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const result = await response.json();
      set({
        data: result,
        error: '',
        lastUpdated: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Dashboard analytics fetch error:', err);
      set({ error: 'Failed to load analytics data' });
    } finally {
      set({ loading: false });
    }
  },

  setDays: (days: number) => {
    set({ days });
  },

  setAutoRefresh: (value: boolean) => {
    set({ autoRefresh: value });
  },
});

export const useAnalyticsDashboardStore = create<DashboardState>(dashboardStore);
