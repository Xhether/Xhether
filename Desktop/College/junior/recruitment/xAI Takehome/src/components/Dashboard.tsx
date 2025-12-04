import { TrendingUp, Users, MessageSquare, Target, Clock, CheckCircle } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { ActivityFeed } from './ActivityFeed';
import { PipelineOverview } from './PipelineOverview';

export function Dashboard() {
  const metrics = [
    {
      label: 'Total Leads',
      value: '247',
      change: '+12%',
      trend: 'up' as const,
      icon: Users,
    },
    {
      label: 'Qualified Leads',
      value: '89',
      change: '+8%',
      trend: 'up' as const,
      icon: Target,
    },
    {
      label: 'Messages Sent',
      value: '1,342',
      change: '+23%',
      trend: 'up' as const,
      icon: MessageSquare,
    },
    {
      label: 'Meetings Booked',
      value: '34',
      change: '+18%',
      trend: 'up' as const,
      icon: CheckCircle,
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Welcome back</h1>
        <p className="text-neutral-400">Here's what's happening with your sales pipeline today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PipelineOverview />
        </div>
        <div>
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
