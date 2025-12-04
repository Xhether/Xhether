import { useState } from 'react';
import { Send, Sparkles, RotateCw, Copy, Mail, Linkedin, MessageCircle } from 'lucide-react';

export function MessagingView() {
  const [selectedLead, setSelectedLead] = useState('acme');
  const [selectedChannel, setSelectedChannel] = useState('email');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const leads = [
    { id: 'acme', name: 'Acme Corporation - John Smith' },
    { id: 'techstart', name: 'TechStart Inc - Sarah Johnson' },
    { id: 'innovate', name: 'Innovate Labs - Michael Chen' },
  ];

  const channels = [
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin },
    { id: 'slack', name: 'Slack', icon: MessageCircle },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setGeneratedMessage(`Hi John,

I hope this message finds you well. I noticed that Acme Corporation has been expanding rapidly in the technology sector, and I wanted to reach out about how we can help accelerate that growth.

Based on my research, I see that your team is currently managing [specific pain point]. Our solution has helped companies similar to Acme achieve:

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
        <p className="text-neutral-400">Generate AI-powered outreach messages tailored to each lead</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration */}
        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-lg mb-4">Message Configuration</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Select Lead</label>
                <select
                  value={selectedLead}
                  onChange={(e) => setSelectedLead(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600"
                >
                  {leads.map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">Channel</label>
                <div className="grid grid-cols-3 gap-2">
                  {channels.map((channel) => {
                    const Icon = channel.icon;
                    return (
                      <button
                        key={channel.id}
                        onClick={() => setSelectedChannel(channel.id)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-colors ${
                          selectedChannel === channel.id
                            ? 'bg-white text-black'
                            : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs">{channel.name}</span>
                      </button>
                    );
                  })}
                </div>
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
                disabled={isGenerating}
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
            </div>
          </div>

          {/* Lead Context */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-lg mb-4">Lead Context</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-neutral-500">Company</p>
                <p>Acme Corporation</p>
              </div>
              <div>
                <p className="text-neutral-500">Industry</p>
                <p>Technology</p>
              </div>
              <div>
                <p className="text-neutral-500">Lead Score</p>
                <p className="text-green-500">92/100</p>
              </div>
              <div>
                <p className="text-neutral-500">Last Interaction</p>
                <p>2 days ago</p>
              </div>
            </div>
          </div>
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
                    <p className="text-sm text-neutral-400 mb-1">Subject</p>
                    <p>Quick question about Acme's growth plans</p>
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
                    Send Message
                  </button>
                  <button className="px-4 py-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
                    Save as Draft
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-neutral-500">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Configure your message parameters and click Generate to create personalized outreach</p>
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
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-neutral-800 rounded-lg hover:bg-neutral-750 cursor-pointer transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm">Acme Corporation - John Smith</p>
                  <p className="text-xs text-neutral-500 mt-1">Email • Professional Tone</p>
                </div>
                <span className="text-xs text-neutral-500">2 hours ago</span>
              </div>
              <p className="text-sm text-neutral-400 line-clamp-2">
                Hi John, I hope this message finds you well. I noticed that Acme Corporation has been...
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
