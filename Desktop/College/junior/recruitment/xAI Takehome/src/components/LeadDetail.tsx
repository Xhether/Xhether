import { ArrowLeft, Mail, Phone, Linkedin, Calendar, TrendingUp, MessageSquare, Edit, Trash2 } from 'lucide-react';

interface LeadDetailProps {
  leadId: string;
  onBack: () => void;
}

export function LeadDetail({ leadId, onBack }: LeadDetailProps) {
  // Mock data - would be fetched based on leadId
  const lead = {
    company: 'Acme Corporation',
    contact: 'John Smith',
    email: 'john@acme.com',
    phone: '+1 (555) 123-4567',
    linkedin: 'linkedin.com/in/johnsmith',
    score: 92,
    stage: 'qualified',
    value: '$45,000',
    industry: 'Technology',
    employees: '500-1000',
    website: 'acme.com',
  };

  const scoreFactors = [
    { name: 'Company Size', score: 95, weight: 30 },
    { name: 'Industry Match', score: 90, weight: 25 },
    { name: 'Engagement Level', score: 88, weight: 20 },
    { name: 'Budget Fit', score: 94, weight: 15 },
    { name: 'Timeline', score: 92, weight: 10 },
  ];

  const activities = [
    {
      type: 'email',
      action: 'Sent personalized outreach email',
      timestamp: '2 days ago',
      grokGenerated: true,
    },
    {
      type: 'response',
      action: 'Received positive response',
      timestamp: '1 day ago',
      grokGenerated: false,
    },
    {
      type: 'analysis',
      action: 'Grok analyzed company profile and updated score',
      timestamp: '1 day ago',
      grokGenerated: true,
    },
    {
      type: 'call',
      action: 'Discovery call scheduled',
      timestamp: '3 hours ago',
      grokGenerated: false,
    },
  ];

  const grokInsights = [
    'Strong fit based on recent company growth and expansion into new markets',
    'Decision maker identified - John Smith has authority over technology purchases',
    'Current solution contract expires in Q2 2026 - optimal timing for outreach',
    'Engaged with similar vendors recently, showing active buying intent',
  ];

  return (
    <div className="p-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Leads
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl mb-2">{lead.company}</h1>
                <p className="text-neutral-400">{lead.contact}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
                  <Edit className="w-5 h-5" />
                </button>
                <button className="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-neutral-500 mb-1">Email</p>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-neutral-400" />
                  <span>{lead.email}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Phone</p>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-neutral-400" />
                  <span>{lead.phone}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Industry</p>
                <span>{lead.industry}</span>
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Employees</p>
                <span>{lead.employees}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors">
                <MessageSquare className="w-4 h-4" />
                Generate Message
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
                <Calendar className="w-4 h-4" />
                Schedule Meeting
              </button>
            </div>
          </div>

          {/* Grok Insights */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-xl mb-4">Grok AI Insights</h2>
            <ul className="space-y-3">
              {grokInsights.map((insight, index) => (
                <li key={index} className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-neutral-300">{insight}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Activity Timeline */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-xl mb-6">Activity Timeline</h2>
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={index} className="flex gap-4 pb-4 border-b border-neutral-800 last:border-0">
                  <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center flex-shrink-0">
                    {activity.grokGenerated ? (
                      <TrendingUp className="w-5 h-5 text-purple-500" />
                    ) : (
                      <div className="w-2 h-2 bg-neutral-600 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-neutral-300">{activity.action}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-neutral-500">{activity.timestamp}</p>
                      {activity.grokGenerated && (
                        <span className="text-xs px-2 py-0.5 bg-purple-500/10 text-purple-500 rounded-full border border-purple-500/20">
                          Grok AI
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Lead Score */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-xl mb-4">Lead Score</h2>
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-neutral-800"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - lead.score / 100)}`}
                    className="text-green-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl">{lead.score}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {scoreFactors.map((factor) => (
                <div key={factor.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-neutral-400">{factor.name}</span>
                    <span className="text-neutral-300">{factor.score}</span>
                  </div>
                  <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${factor.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stage & Value */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-xl mb-4">Pipeline Info</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-neutral-500 mb-2">Current Stage</p>
                <div className="px-3 py-2 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-lg text-center capitalize">
                  {lead.stage}
                </div>
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-2">Deal Value</p>
                <p className="text-2xl">{lead.value}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
