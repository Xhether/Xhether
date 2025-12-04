import { useState } from 'react';
import { Search, Filter, Plus, ChevronDown } from 'lucide-react';
import { LeadCard } from './LeadCard';

interface LeadsViewProps {
  onSelectLead: (leadId: string) => void;
}

export function LeadsView({ onSelectLead }: LeadsViewProps) {
  const [selectedStage, setSelectedStage] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const stages = ['all', 'new', 'contacted', 'qualified', 'proposal', 'closed'];

  const leads = [
    {
      id: '1',
      company: 'Acme Corporation',
      contact: 'John Smith',
      email: 'john@acme.com',
      score: 92,
      stage: 'qualified',
      lastContact: '2 days ago',
      value: '$45,000',
    },
    {
      id: '2',
      company: 'TechStart Inc',
      contact: 'Sarah Johnson',
      email: 'sarah@techstart.com',
      score: 85,
      stage: 'contacted',
      lastContact: '1 day ago',
      value: '$32,000',
    },
    {
      id: '3',
      company: 'Innovate Labs',
      contact: 'Michael Chen',
      email: 'michael@innovatelabs.com',
      score: 78,
      stage: 'new',
      lastContact: '3 hours ago',
      value: '$58,000',
    },
    {
      id: '4',
      company: 'DataCo Solutions',
      contact: 'Emily Davis',
      email: 'emily@dataco.com',
      score: 95,
      stage: 'proposal',
      lastContact: '5 days ago',
      value: '$72,000',
    },
    {
      id: '5',
      company: 'CloudTech Systems',
      contact: 'Robert Wilson',
      email: 'robert@cloudtech.com',
      score: 88,
      stage: 'qualified',
      lastContact: '1 week ago',
      value: '$38,000',
    },
    {
      id: '6',
      company: 'Enterprise Co',
      contact: 'Lisa Anderson',
      email: 'lisa@enterpriseco.com',
      score: 71,
      stage: 'contacted',
      lastContact: '4 days ago',
      value: '$95,000',
    },
  ];

  const filteredLeads = leads.filter((lead) => {
    const matchesStage = selectedStage === 'all' || lead.stage === selectedStage;
    const matchesSearch = 
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contact.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl mb-2">Leads</h1>
          <p className="text-neutral-400">Manage and track your sales prospects</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors">
          <Plus className="w-5 h-5" />
          Add Lead
        </button>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:border-neutral-600"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg hover:bg-neutral-800 transition-colors">
          <Filter className="w-5 h-5" />
          Filter
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {stages.map((stage) => (
          <button
            key={stage}
            onClick={() => setSelectedStage(stage)}
            className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap transition-colors ${
              selectedStage === stage
                ? 'bg-white text-black'
                : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
            }`}
          >
            {stage}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredLeads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} onClick={() => onSelectLead(lead.id)} />
        ))}
      </div>
    </div>
  );
}
