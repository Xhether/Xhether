import { Building2, User, Mail, TrendingUp, Clock } from 'lucide-react';

interface Lead {
  id: string;
  company: string;
  contact: string;
  email: string;
  score: number;
  stage: string;
  lastContact: string;
  value: string;
}

interface LeadCardProps {
  lead: Lead;
  onClick: () => void;
}

export function LeadCard({ lead, onClick }: LeadCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 75) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      contacted: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      qualified: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      proposal: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      closed: 'bg-green-500/10 text-green-500 border-green-500/20',
    };
    return colors[stage] || colors.new;
  };

  return (
    <div
      onClick={onClick}
      className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-neutral-700 transition-all cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-neutral-800 rounded-lg">
            <Building2 className="w-5 h-5 text-neutral-400" />
          </div>
          <div>
            <h3 className="font-medium">{lead.company}</h3>
            <p className="text-sm text-neutral-500">{lead.value}</p>
          </div>
        </div>
        <div className={`text-2xl ${getScoreColor(lead.score)}`}>
          {lead.score}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <User className="w-4 h-4" />
          {lead.contact}
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <Mail className="w-4 h-4" />
          {lead.email}
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <Clock className="w-4 h-4" />
          Last contact: {lead.lastContact}
        </div>
      </div>

      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm border ${getStageColor(lead.stage)}`}>
        <span className="capitalize">{lead.stage}</span>
      </div>
    </div>
  );
}
