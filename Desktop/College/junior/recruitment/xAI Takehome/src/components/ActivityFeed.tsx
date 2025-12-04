import { Clock, Mail, Phone, Calendar, MessageSquare } from 'lucide-react';

export function ActivityFeed() {
  const activities = [
    {
      type: 'email',
      icon: Mail,
      message: 'Email sent to Acme Corp',
      time: '5 mins ago',
      color: 'text-blue-500',
    },
    {
      type: 'call',
      icon: Phone,
      message: 'Call scheduled with TechStart',
      time: '23 mins ago',
      color: 'text-green-500',
    },
    {
      type: 'meeting',
      icon: Calendar,
      message: 'Meeting completed with Innovate Inc',
      time: '1 hour ago',
      color: 'text-purple-500',
    },
    {
      type: 'message',
      icon: MessageSquare,
      message: 'LinkedIn message to DataCo',
      time: '2 hours ago',
      color: 'text-yellow-500',
    },
    {
      type: 'email',
      icon: Mail,
      message: 'Follow-up sent to CloudTech',
      time: '3 hours ago',
      color: 'text-blue-500',
    },
  ];

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <h2 className="text-xl mb-6">Recent Activity</h2>
      
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div key={index} className="flex gap-3">
              <div className={`p-2 bg-neutral-800 rounded-lg h-fit ${activity.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-neutral-300">{activity.message}</p>
                <p className="text-xs text-neutral-500 mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
