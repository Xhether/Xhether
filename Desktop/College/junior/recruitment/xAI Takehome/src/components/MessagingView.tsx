import { useState } from 'react';
import { Send, Sparkles, RotateCw, Copy, Mail, Search, X, Building2, User } from 'lucide-react';

export function MessagingView() {
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock leads database
  const allLeads = [
    { id: '1', name: 'John Smith', company: 'Acme Corporation', email: 'john@acme.com', score: 92 },
    { id: '2', name: 'Sarah Johnson', company: 'TechStart Inc', email: 'sarah@techstart.com', score: 85 },
    { id: '3', name: 'Michael Chen', company: 'Innovate Labs', email: 'michael@innovatelabs.com', score: 78 },
    { id: '4', name: 'Emily Davis', company: 'DataCo Solutions', email: 'emily@dataco.com', score: 95 },
    { id: '5', name: 'Robert Wilson', company: 'CloudTech Systems', email: 'robert@cloudtech.com', score: 88 },
    { id: '6', name: 'Lisa Anderson', company: 'Enterprise Co', email: 'lisa@enterpriseco.com', score: 71 },
    { id: '7', name: 'David Martinez', company: 'StartupXYZ', email: 'david@startupxyz.com', score: 82 },
    { id: '8', name: 'Jennifer Lee', company: 'Global Tech', email: 'jennifer@globaltech.com', score: 90 },
  ];

  const filteredLeads = allLeads.filter(lead =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectLead = (lead: any) => {
    setSelectedLead(lead);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const handleGenerate = () => {
    if (!selectedLead) return;

    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setGeneratedMessage(`Hi ${selectedLead.name.split(' ')[0]},

I hope this message finds you well. I noticed that ${selectedLead.company} has been expanding rapidly in the technology sector, and I wanted to reach out about how we can help accelerate that growth.

Based on my research, I see that your team is currently managing [specific pain point]. Our solution has helped companies similar to ${selectedLead.company} achieve:

• 40% reduction in operational costs
• 3x faster time-to-market for new features
• Seamless integration with your existing tech stack

I'd love to schedule a brief 15-minute call to explore if there's a fit. Would next Tuesday or Thursday work for you?

Looking forward to connecting!

Best regards`);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Personalized Messaging</h1>
        <p className="text-neutral-400">Generate AI-powered email outreach messages tailored to each lead</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration */}
        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-lg mb-4">Message Configuration</h2>

            <div className="space-y-4">
              {/* Lead Search & Selection */}
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Select Lead</label>

                {selectedLead ? (
                  <div className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                          <p className="text-sm truncate">{selectedLead.name}</p>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <Building2 className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                          <p className="text-sm text-neutral-500 truncate">{selectedLead.company}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                          <p className="text-xs text-neutral-500 truncate">{selectedLead.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedLead(null)}
                        className="p-1 hover:bg-neutral-700 rounded transition-colors flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="Search by name, company, or email..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSearchResults(true);
                      }}
                      onFocus={() => setShowSearchResults(true)}
                      className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600"
                    />

                    {showSearchResults && searchQuery && (
                      <div className="absolute z-10 w-full mt-2 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                        {filteredLeads.length > 0 ? (
                          filteredLeads.map((lead) => (
                            <button
                              key={lead.id}
                              onClick={() => handleSelectLead(lead)}
                              className="w-full p-3 hover:bg-neutral-700 transition-colors text-left border-b border-neutral-700 last:border-0"
                            >
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <p className="text-sm">{lead.name}</p>
                                <span className="text-xs text-green-500">{lead.score}</span>
                              </div>
                              <p className="text-xs text-neutral-400">{lead.company}</p>
                              <p className="text-xs text-neutral-500">{lead.email}</p>
                            </button>
                          ))
                        ) : (
                          <div className="p-4 text-sm text-neutral-500 text-center">
                            No leads found matching "{searchQuery}"
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">Tone</label>
                <select className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600">
                  <option>Professional</option>
                  <option>Casual</option>
                  <option>Friendly</option>
                  <option>Formal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">Message Goal</label>
                <select className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600">
                  <option>Schedule Meeting</option>
                  <option>Initial Outreach</option>
                  <option>Follow-up</option>
                  <option>Share Resources</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">Grok Model</label>
                <select className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600">
                  <option>Grok 4 Fast (Reasoning)</option>
                  <option>Grok 3</option>
                  <option>Grok 4 Fast (Non-Reasoning)</option>
                </select>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !selectedLead}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <RotateCw className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Message
                  </>
                )}
              </button>

              {!selectedLead && (
                <p className="text-xs text-neutral-500 text-center">Select a lead to generate message</p>
              )}
            </div>
          </div>

          {/* Lead Context */}
          {selectedLead && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h2 className="text-lg mb-4">Lead Context</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-neutral-500">Contact</p>
                  <p>{selectedLead.name}</p>
                </div>
                <div>
                  <p className="text-neutral-500">Company</p>
                  <p>{selectedLead.company}</p>
                </div>
                <div>
                  <p className="text-neutral-500">Email</p>
                  <p className="text-neutral-400">{selectedLead.email}</p>
                </div>
                <div>
                  <p className="text-neutral-500">Lead Score</p>
                  <p className="text-green-500">{selectedLead.score}/100</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message Preview */}
        <div className="lg:col-span-2">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg">Generated Message</h2>
              {generatedMessage && (
                <div className="flex gap-2">
                  <button className="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleGenerate}
                    className="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {generatedMessage ? (
              <>
                <div className="flex-1 mb-4">
                  <div className="p-4 bg-neutral-800 rounded-lg mb-4">
                    <p className="text-sm text-neutral-400 mb-1">To</p>
                    <p className="mb-3">{selectedLead?.email}</p>
                    <p className="text-sm text-neutral-400 mb-1">Subject</p>
                    <input
                      type="text"
                      defaultValue={`Quick question about ${selectedLead?.company}'s growth plans`}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600"
                    />
                  </div>
                  <textarea
                    value={generatedMessage}
                    onChange={(e) => setGeneratedMessage(e.target.value)}
                    className="w-full h-96 p-4 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600 resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors">
                    <Send className="w-5 h-5" />
                    Send Email
                  </button>
                  <button className="px-4 py-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
                    Save as Draft
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-neutral-500 max-w-md">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="mb-2">Select a lead and configure your message parameters</p>
                  <p className="text-sm">Click Generate to create personalized email outreach</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Previous Messages */}
      <div className="mt-6 bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <h2 className="text-lg mb-4">Recent Generated Messages</h2>
        <div className="space-y-3">
          {[
            { lead: 'John Smith', company: 'Acme Corporation', time: '2 hours ago' },
            { lead: 'Sarah Johnson', company: 'TechStart Inc', time: '5 hours ago' },
            { lead: 'Michael Chen', company: 'Innovate Labs', time: '1 day ago' },
          ].map((item, i) => (
            <div key={i} className="p-4 bg-neutral-800 rounded-lg hover:bg-neutral-750 cursor-pointer transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm">{item.company} - {item.lead}</p>
                  <p className="text-xs text-neutral-500 mt-1">Email • Professional Tone</p>
                </div>
                <span className="text-xs text-neutral-500">{item.time}</span>
              </div>
              <p className="text-sm text-neutral-400 line-clamp-2">
                Hi {item.lead.split(' ')[0]}, I hope this message finds you well. I noticed that {item.company} has been...
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}