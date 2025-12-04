import { useState, useEffect } from 'react';
import React from 'react';
import { ArrowLeft, Mail, Phone, Linkedin, Calendar, TrendingUp, MessageSquare, Edit, Trash2, Save, X } from 'lucide-react';
import { clearCache } from '../utils/cache';

interface LeadDetailProps {
  leadId: string;
  onBack: () => void;
}

interface Lead {
  id: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  score: number;
  stage: string;
  value: string;
  industry: string;
  employees?: string;
  website?: string;
  location?: string;
  job_title?: string;
  linkedin?: string;
  notes?: string;
  tags?: string[];
  last_contact?: string;
  insights?: string[];
}

export function LeadDetail({ leadId, onBack }: LeadDetailProps) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit Form State
  const [editForm, setEditForm] = useState<Partial<Lead>>({});

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const response = await fetch(`http://localhost:8000/leads/${leadId}`);
        if (!response.ok) throw new Error('Failed to fetch lead');
        const data = await response.json();
        setLead(data);
        setEditForm(data);
      } catch (err) {
        setError('Failed to load lead data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [leadId]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      const response = await fetch(`http://localhost:8000/leads/${leadId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        clearCache('dashboard_data'); // Refresh dashboard stats
        onBack();
      } else {
        alert('Failed to delete lead');
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('Error connecting to server');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`http://localhost:8000/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        setIsEditing(false);
        clearCache('dashboard_data');

        // Re-fetch the lead to get the latest data
        const fetchResponse = await fetch(`http://localhost:8000/leads/${leadId}`);
        if (fetchResponse.ok) {
          const updatedData = await fetchResponse.json();
          setLead(updatedData);
          setEditForm(updatedData);
        }

        // Poll for Grok updates if needed
        const criticalFields = ['company', 'industry', 'employees', 'location', 'job_title'];
        const changedCritical = Object.keys(editForm).some(k =>
          criticalFields.includes(k) && editForm[k as keyof Lead] !== lead?.[k as keyof Lead]
        );

        if (changedCritical && lead) {
          setTimeout(async () => {
            const pollResponse = await fetch(`http://localhost:8000/leads/${leadId}`);
            if (pollResponse.ok) {
              const updatedData = await pollResponse.json();
              setLead(updatedData);
              setEditForm(updatedData);
            }
          }, 3500);
        }
      } else {
        alert('Failed to update lead');
      }
    } catch (error) {
      console.error('Error updating lead:', error);
      alert('Error connecting to server');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsArray = e.target.value.split(',').map(t => t.trim());
    setEditForm(prev => ({ ...prev, tags: tagsArray }));
  };

  if (loading) return <div className="p-8 text-white">Loading...</div>;
  if (error || !lead) return <div className="p-8 text-red-500">{error || 'Lead not found'}</div>;

  // Mock score factors (could come from backend later)
  const scoreFactors = [
    { name: 'Company Size', score: 95, weight: 30 },
    { name: 'Industry Match', score: 90, weight: 25 },
    { name: 'Engagement Level', score: 88, weight: 20 },
    { name: 'Budget Fit', score: 94, weight: 15 },
    { name: 'Timeline', score: 92, weight: 10 },
  ];

  // Mock activities for now
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
              <div className="flex-1 mr-4">
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      name="company"
                      value={editForm.company}
                      onChange={handleInputChange}
                      className="text-3xl font-bold bg-neutral-800 border border-neutral-700 rounded px-2 py-1 w-full"
                      placeholder="Company Name"
                    />
                    <input
                      name="contact"
                      value={editForm.contact}
                      onChange={handleInputChange}
                      className="text-neutral-400 bg-neutral-800 border border-neutral-700 rounded px-2 py-1 w-full"
                      placeholder="Contact Name"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl mb-2">{lead.company}</h1>
                    <p className="text-neutral-400">{lead.contact}</p>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditForm(lead); // Reset form
                      }}
                      className="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleDelete}
                      className="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-neutral-500 mb-1">Email</p>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-neutral-400" />
                  {isEditing ? (
                    <input
                      name="email"
                      value={editForm.email}
                      onChange={handleInputChange}
                      placeholder="e.g., john@acme.com"
                      className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 w-full"
                    />
                  ) : (
                    <span>{lead.email}</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Phone</p>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-neutral-400" />
                  {isEditing ? (
                    <input
                      name="phone"
                      value={editForm.phone || ''}
                      onChange={handleInputChange}
                      placeholder="e.g., +1 (555) 123-4567"
                      className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 w-full"
                    />
                  ) : (
                    <span>{lead.phone || 'N/A'}</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Industry</p>
                {isEditing ? (
                  <input
                    name="industry"
                    value={editForm.industry || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., Technology"
                    className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 w-full"
                  />
                ) : (
                  <span>{lead.industry || 'N/A'}</span>
                )}
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Employees</p>
                {isEditing ? (
                  <select
                    name="employees"
                    value={editForm.employees || ''}
                    onChange={handleInputChange}
                    className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 w-full"
                  >
                    <option value="">Select size</option>
                    <option>1-10</option>
                    <option>11-50</option>
                    <option>51-200</option>
                    <option>201-500</option>
                    <option>501-1000</option>
                    <option>1000+</option>
                  </select>
                ) : (
                  <span>{lead.employees || 'N/A'}</span>
                )}
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Website</p>
                {isEditing ? (
                  <input
                    name="website"
                    value={editForm.website || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., https://example.com"
                    className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 w-full"
                  />
                ) : (
                  <span>{lead.website || 'N/A'}</span>
                )}
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Location</p>
                {isEditing ? (
                  <input
                    name="location"
                    value={editForm.location || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., San Francisco, CA"
                    className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 w-full"
                  />
                ) : (
                  <span>{lead.location || 'N/A'}</span>
                )}
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Job Title</p>
                {isEditing ? (
                  <input
                    name="job_title"
                    value={editForm.job_title || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., VP of Sales"
                    className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 w-full"
                  />
                ) : (
                  <span>{lead.job_title || 'N/A'}</span>
                )}
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">LinkedIn</p>
                {isEditing ? (
                  <input
                    name="linkedin"
                    value={editForm.linkedin || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., linkedin.com/in/johnsmith"
                    className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 w-full"
                  />
                ) : (
                  <span>{lead.linkedin || 'N/A'}</span>
                )}
              </div>
            </div>

            {/* Additional Info Section (Notes and Tags) */}
            <div className="space-y-4 mt-6 pt-6 border-t border-neutral-800">
              <div>
                <p className="text-sm text-neutral-500 mb-1">Notes</p>
                {isEditing ? (
                  <textarea
                    name="notes"
                    value={editForm.notes || ''}
                    onChange={handleInputChange}
                    placeholder="Add any relevant notes about this lead..."
                    className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 w-full min-h-[100px]"
                  />
                ) : (
                  <p className="text-neutral-300">{lead.notes || 'No notes available'}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Tags</p>
                {isEditing ? (
                  <input
                    name="tags"
                    value={(editForm.tags || []).join(', ')}
                    onChange={handleTagsChange}
                    placeholder="e.g., high-priority, enterprise, q1-target"
                    className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 w-full"
                  />
                ) : (
                  <p className="text-neutral-300">{(lead.tags || []).join(', ') || 'No tags'}</p>
                )}
              </div>
            </div>

            {!isEditing && (
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
            )}
          </div>

          {/* Grok Insights */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-xl mb-4">Grok AI Insights</h2>
            {lead.insights && lead.insights.length > 0 ? (
              <ul className="space-y-3">
                {lead.insights.map((insight, index) => (
                  <li key={index} className="flex gap-3">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-neutral-300">{insight}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-neutral-500 italic">No insights available yet. Check back after AI processing.</p>
            )}
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
                {isEditing ? (
                  <select
                    name="stage"
                    value={editForm.stage}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none capitalize"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal">Proposal</option>
                    <option value="closed">Closed</option>
                  </select>
                ) : (
                  <div className="px-3 py-2 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-lg text-center capitalize">
                    {lead.stage}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-2">Deal Value</p>
                {isEditing ? (
                  <input
                    name="value"
                    value={editForm.value}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1"
                  />
                ) : (
                  <p className="text-2xl">{lead.value}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}