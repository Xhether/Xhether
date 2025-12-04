import { useState, useEffect } from 'react';
import { Search, Filter, Plus, ChevronDown } from 'lucide-react';
import { LeadCard } from './LeadCard';
import { AddLeadView } from './AddLeadView';
import { clearCache } from '../utils/cache';

interface LeadsViewProps {
  onSelectLead: (leadId: string) => void;
}

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

export function LeadsView({ onSelectLead }: LeadsViewProps) {
  const [view, setView] = useState<'list' | 'add'>('list');
  const [selectedStage, setSelectedStage] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const stages = ['all', 'new', 'contacted', 'qualified', 'proposal', 'closed'];

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/leads');
      if (response.ok) {
        const data = await response.json();
        const formattedLeads = data.map((item: any) => ({
          id: item.id,
          company: item.company,
          contact: item.contact,
          email: item.email,
          score: item.score,
          stage: item.stage,
          lastContact: item.last_contact ? new Date(item.last_contact).toLocaleDateString() : 'Never',
          value: item.value,
        }));
        setLeads(formattedLeads);
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'list') {
      fetchLeads();
    }
  }, [view]);

  const handleSaveLead = () => {
    setView('list');
    // Clear dashboard cache so numbers update
    clearCache('dashboard_data');
    fetchLeads();
  };

  if (view === 'add') {
    return <AddLeadView onBack={() => setView('list')} onSave={handleSaveLead} />;
  }

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
        <button 
          onClick={() => setView('add')}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors"
        >
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
