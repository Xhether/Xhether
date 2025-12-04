import { useState, useEffect } from 'react';
import { TrendingUp, Users, MessageSquare, Target, Clock, CheckCircle } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { ActivityFeed } from './ActivityFeed';
import { PipelineOverview } from './PipelineOverview';
import { getCachedData, setCachedData } from '../utils/cache';

const DASHBOARD_CACHE_KEY = 'dashboard_data';
const CACHE_TTL = 60; // Cache for 60 seconds

export function Dashboard() {
  // Initialize state from cache if available to prevent loading flash
  const cached = getCachedData<any>(DASHBOARD_CACHE_KEY, CACHE_TTL);

  const [metrics, setMetrics] = useState(cached?.metrics || {
    total_leads: 0,
    qualified_leads: 0,
    messages_sent: 0,
    meetings_booked: 0,
  });
  const [pipeline, setPipeline] = useState(cached?.pipeline || []);
  const [activities, setActivities] = useState(cached?.recent_activities || []);
  const [loading, setLoading] = useState(!cached); // Only load if no cache

  useEffect(() => {
    const fetchDashboard = async () => {
      // Even if we have cache, we might want to re-verify if it's stale
      // But getCachedData handles expiration. If it returned null, we fetch.
      if (cached) return;

      try {
        const response = await fetch('http://localhost:8000/dashboard');
        if (response.ok) {
          const data = await response.json();
          setMetrics(data.metrics);
          setPipeline(data.pipeline);
          setActivities(data.recent_activities);

          // Update Cache
          setCachedData(DASHBOARD_CACHE_KEY, data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []); // Dependency array empty means this runs once on mount

  const metricCards = [
    {
      label: 'Total Leads',
      value: metrics.total_leads.toString(),
      change: '', // TODO: Calculate change
      trend: 'up' as const,
      icon: Users,
    },
    {
      label: 'Qualified Leads',
      value: metrics.qualified_leads.toString(),
      change: '',
      trend: 'up' as const,
      icon: Target,
    },
    {
      label: 'Messages Sent',
      value: metrics.messages_sent.toString(),
      change: '',
      trend: 'up' as const,
      icon: MessageSquare,
    },
    {
      label: 'Meetings Booked',
      value: metrics.meetings_booked.toString(),
      change: '',
      trend: 'up' as const,
      icon: CheckCircle,
    },
  ];

  if (loading) {
    return <div className="p-8 text-white">Loading dashboard...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Welcome back</h1>
        <p className="text-neutral-400">Here's what's happening with your sales pipeline today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metricCards.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PipelineOverview data={pipeline} />
        </div>
        <div>
          <ActivityFeed activities={activities} />
        </div>
      </div>
    </div>
  );
}
