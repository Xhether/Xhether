import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
}

export function MetricCard({ label, value, change, trend, icon: Icon }: MetricCardProps) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-neutral-800 rounded-lg">
          <Icon className="w-5 h-5 text-neutral-400" />
        </div>
        <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {change}
        </div>
      </div>
      <div className="text-3xl mb-1">{value}</div>
      <div className="text-sm text-neutral-400">{label}</div>
    </div>
  );
}
