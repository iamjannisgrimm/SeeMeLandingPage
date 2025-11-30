'use client';

import { useEffect, useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { format, parseISO } from 'date-fns';

interface AnalyticsData {
  events: any[];
  metrics: {
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
  };
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, [days]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics?days=${days}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const result = await response.json();
      setData(result);
      setError('');
    } catch (err) {
      setError('Failed to load analytics data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading analytics...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-400 text-xl">{error || 'No data available'}</div>
      </div>
    );
  }

  const { metrics } = data;

  // Prepare chart data
  const deviceData = Object.entries(metrics.deviceCounts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  const eventTypeData = Object.entries(metrics.eventTypeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, value]) => ({
      name: name.replace(/_/g, ' '),
      count: value
    }));

  const sectionData = Object.entries(metrics.sectionViews)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({
      name,
      views: value
    }));

  const hourlyData = Object.entries(metrics.hourlyTraffic)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([hour, count]) => ({
      hour: format(parseISO(hour + ':00:00'), 'MMM d, ha'),
      events: count
    }));

  const ctaData = Object.entries(metrics.ctaClicks)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({
      name,
      clicks: value,
    }));

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">SeeMe Analytics Dashboard</h1>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
          >
            <option value={1}>Last 24 hours</option>
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
        <p className="text-gray-400">Real-time insights into your landing page performance</p>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            title="Unique Users"
            value={metrics.uniqueUsers}
            icon="👥"
          />
          <MetricCard
            title="Page Views"
            value={metrics.pageViews}
            icon="👁️"
          />
          <MetricCard
            title="Completion Rate"
            value={`${metrics.completionRate}%`}
            icon="✅"
            subtitle="Users who scrolled to end"
          />
          <MetricCard
            title="Avg Session"
            value={`${metrics.avgSessionDuration}s`}
            icon="⏱️"
          />
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            title="Avg Video Load Time"
            value={`${metrics.avgVideoLoadTime}ms`}
            icon="🎥"
            subtitle="Lower is better"
          />
          <MetricCard
            title="Video Error Rate"
            value={`${metrics.videoErrorRate}%`}
            icon="⚠️"
            subtitle="Video loading failures"
          />
          <MetricCard
            title="Total Sessions"
            value={metrics.uniqueSessions}
            icon="🔄"
          />
          <MetricCard
            title="Total CTA Clicks"
            value={metrics.totalCtaClicks}
            icon="📲"
            subtitle="All primary button clicks"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Device Breakdown */}
          <ChartCard title="Device Breakdown">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Event Types */}
          <ChartCard title="Top Events">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9ca3af"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* CTA Clicks */}
          <ChartCard title="CTA Clicks">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ctaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9ca3af"
                  angle={-20}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="clicks" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Section Engagement */}
          <ChartCard title="Section Engagement">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sectionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9ca3af" />
                <YAxis dataKey="name" type="category" stroke="#9ca3af" width={120} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="views" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Hourly Traffic */}
          <ChartCard title="Traffic Over Time">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="hour" 
                  stroke="#9ca3af"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="events" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Recent Events Table */}
        <ChartCard title="Recent Events">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-700">
                <tr className="text-left">
                  <th className="pb-2">Time</th>
                  <th className="pb-2">Event</th>
                  <th className="pb-2">Device</th>
                  <th className="pb-2">Details</th>
                </tr>
              </thead>
              <tbody>
                {data.events.slice(0, 20).map((event, i) => (
                  <tr key={i} className="border-b border-gray-800">
                    <td className="py-2 text-gray-400">
                      {format(parseISO(event.created_at), 'MMM d, h:mm a')}
                    </td>
                    <td className="py-2">{event.event_type.replace(/_/g, ' ')}</td>
                    <td className="py-2 text-gray-400">
                      {event.event_data?.device_type || 'unknown'}
                    </td>
                    <td className="py-2 text-gray-400 truncate max-w-xs">
                      {JSON.stringify(event.event_data).slice(0, 100)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

function MetricCard({ 
  title, 
  value, 
  icon, 
  subtitle 
}: { 
  title: string; 
  value: string | number; 
  icon: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 text-sm">{title}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-3xl font-bold">{value}</div>
      {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}
