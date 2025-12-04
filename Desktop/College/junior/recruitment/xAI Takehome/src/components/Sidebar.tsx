import { LayoutDashboard, Users, BarChart3, MessageSquare, Settings, Zap } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'evaluation', label: 'Model Evaluation', icon: BarChart3 },
    { id: 'messaging', label: 'Messaging', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-neutral-950 border-r border-neutral-800 flex flex-col">
      <div className="p-6 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6" />
          <span className="text-xl">Grok SDR</span>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    currentView === item.id
                      ? 'bg-neutral-800 text-white'
                      : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-neutral-800">
        <div className="px-4 py-2 text-sm text-neutral-500">
          Powered by Grok API
        </div>
      </div>
    </div>
  );
}
