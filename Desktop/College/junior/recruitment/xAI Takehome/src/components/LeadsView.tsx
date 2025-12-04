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
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleLeadSelect = (leadId: string, checked: boolean) => {
    if (checked) {
      setSelectedLeads(prev => [...prev, leadId]);
    } else {
      setSelectedLeads(prev => prev.filter(id => id !== leadId));
    }
  };

  const handleNotifySelected = async () => {
    if (selectedLeads.length === 0) {
      alert('Select at least one qualified lead.');
      return;
    }

    if (!confirm(`Notify ${selectedLeads.length} selected leads?`)) return;

    try {
      const response = await fetch('http://localhost:8000/leads/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedLeads),
      });
      if (response.ok) {
        const result = await response.json();
        alert(`${result.notified} leads notified successfully!`);
        setSelectedLeads([]); // Clear selection
        fetchLeads(); // Refresh list
        clearCache('dashboard_data'); // Update metrics
      } else {
        alert('Failed to notify leads.');
      }
    } catch (error) {
      console.error('Notification error:', error);
      alert('Error connecting to server.');
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesStage = selectedStage === 'all' || lead.stage === selectedStage;
    const matchesSearch =
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contact.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  return (
    <div className="p-6">
      {/* Header with filter and notify button */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <h1 className="text-2xl font-bold">Leads</h1>
          {view === 'list' && (
            <>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="bg-neutral-800 border border-neutral-700 rounded px-3 py-1 text-white"
              >
                <option value="all">All Stages</option>
                <option value="qualified">Qualified Only</option>
                {/* ... other stages ... */}
              </select>
              <button
                onClick={() => setView('add')}
                className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-neutral-200"
              >
                <Plus className="w-4 h-4" />
                Add Lead
              </button>
            </>
          )}
        </div>
        {view === 'list' && selectedLeads.length > 0 && selectedStage === 'qualified' && (
          <button
            onClick={handleNotifySelected}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Notify Selected ({selectedLeads.length})
          </button>
        )}
      </div>

      {view === 'add' ? (
        <AddLeadView onBack={() => setView('list')} onSave={handleSaveLead} />
      ) : (
        <div>
          {/* Select All Checkbox */}
          {filteredLeads.length > 0 && selectedStage === 'qualified' && (
            <div className="mb-4 flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedLeads.length === filteredLeads.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded"
              />
              <label className="text-sm text-neutral-400">Select All ({filteredLeads.length} qualified)</label>
            </div>
          )}

          {/* Leads List - Fixed height, scrollable */}
          <div className="max-h-96 overflow-y-auto space-y-2">  {/* Fixed height, scrollable, smaller spacing */}
            {filteredLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onClick={() => onSelectLead(lead.id)}
                isSelected={selectedLeads.includes(lead.id)}
                onSelect={() => handleLeadSelect(lead.id, !selectedLeads.includes(lead.id))}
                selectedStage={selectedStage}
              />
            ))}
          </div>

          {filteredLeads.length === 0 && (
            <p className="text-center text-neutral-400 mt-8">No leads match the filter.</p>
          )}
        </div>
      )}
    </div>
  );
}
