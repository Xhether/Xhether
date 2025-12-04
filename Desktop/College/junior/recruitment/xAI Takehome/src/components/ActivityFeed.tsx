import { Clock, Mail, Phone, Calendar, MessageSquare, Activity } from 'lucide-react';

interface ActivityItem {
  type: string;
  action: string; // Mapped from 'message' or 'action' in backend
  created_at?: string;
}

interface ActivityFeedProps {
  activities?: ActivityItem[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const displayActivities = activities || []; // Default to empty if loading/undefined

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <h2 className="text-xl mb-6">Recent Activity</h2>
      
      <div className="space-y-4">
        {displayActivities.length === 0 ? (
           <p className="text-neutral-500 text-sm">No recent activity.</p>
        ) : (
          displayActivities.map((activity, index) => {
            const { Icon, color } = getIconAndColor(activity.type);
            return (
              <div key={index} className="flex gap-3">
                <div className={`p-2 bg-neutral-800 rounded-lg h-fit ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-neutral-300">{activity.action}</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {activity.created_at ? new Date(activity.created_at).toLocaleString() : 'Just now'}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function getIconAndColor(type: string) {
  switch (type.toLowerCase()) {
    case 'email':
      return { Icon: Mail, color: 'text-blue-500' };
    case 'call':
      return { Icon: Phone, color: 'text-green-500' };
    case 'meeting':
      return { Icon: Calendar, color: 'text-purple-500' };
    case 'message':
      return { Icon: MessageSquare, color: 'text-yellow-500' };
    case 'analysis':
      return { Icon: Activity, color: 'text-pink-500' };
    default:
      return { Icon: Clock, color: 'text-gray-500' };
  }
}

