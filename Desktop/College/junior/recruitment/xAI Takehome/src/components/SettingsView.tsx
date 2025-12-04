import { useState } from 'react';
import { Save, Plus, Trash2, GripVertical } from 'lucide-react';

export function SettingsView() {
  const [scoringCriteria, setScoringCriteria] = useState([
    { id: '1', name: 'Company Size', weight: 30, enabled: true },
    { id: '2', name: 'Industry Match', weight: 25, enabled: true },
    { id: '3', name: 'Engagement Level', weight: 20, enabled: true },
    { id: '4', name: 'Budget Fit', weight: 15, enabled: true },
    { id: '5', name: 'Timeline', weight: 10, enabled: true },
  ]);

  const handleWeightChange = (id: string, newWeight: number) => {
    setScoringCriteria(prev =>
      prev.map(criteria =>
        criteria.id === id ? { ...criteria, weight: newWeight } : criteria
      )
    );
  };

  const handleToggle = (id: string) => {
    setScoringCriteria(prev =>
      prev.map(criteria =>
        criteria.id === id ? { ...criteria, enabled: !criteria.enabled } : criteria
      )
    );
  };

  const totalWeight = scoringCriteria
    .filter(c => c.enabled)
    .reduce((sum, c) => sum + c.weight, 0);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Settings</h1>
        <p className="text-neutral-400">Configure lead scoring criteria and system preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Scoring Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl mb-1">Lead Scoring Criteria</h2>
                <p className="text-sm text-neutral-400">Define what's important in scoring your leads</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
                <Plus className="w-4 h-4" />
                Add Criteria
              </button>
            </div>

            <div className="space-y-4">
              {scoringCriteria.map((criteria) => (
                <div
                  key={criteria.id}
                  className={`p-4 bg-neutral-800 rounded-lg transition-opacity ${
                    !criteria.enabled && 'opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <button className="cursor-grab active:cursor-grabbing text-neutral-500 hover:text-neutral-400">
                      <GripVertical className="w-5 h-5" />
                    </button>
                    <input
                      type="checkbox"
                      checked={criteria.enabled}
                      onChange={() => handleToggle(criteria.id)}
                      className="w-4 h-4 rounded border-neutral-600 bg-neutral-700"
                    />
                    <span className="flex-1">{criteria.name}</span>
                    <button className="text-neutral-500 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {criteria.enabled && (
                    <div className="ml-11">
                      <div className="flex items-center gap-4">
                        <label className="text-sm text-neutral-400 min-w-[60px]">Weight: {criteria.weight}%</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={criteria.weight}
                          onChange={(e) => handleWeightChange(criteria.id, parseInt(e.target.value))}
                          className="flex-1 h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-neutral-800">
              <div className="flex justify-between items-center mb-4">
                <span className="text-neutral-400">Total Weight</span>
                <span className={`text-xl ${totalWeight === 100 ? 'text-green-500' : 'text-orange-500'}`}>
                  {totalWeight}%
                </span>
              </div>
              {totalWeight !== 100 && (
                <p className="text-sm text-orange-500 mb-4">
                  ⚠️ Total weight should equal 100% for accurate scoring
                </p>
              )}
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors">
                <Save className="w-5 h-5" />
                Save & Re-score All Leads
              </button>
            </div>
          </div>

          {/* API Configuration */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-xl mb-6">Grok API Configuration</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">API Key</label>
                <input
                  type="password"
                  value="xai-••••••••••••••••"
                  readOnly
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600"
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">Default Model</label>
                <select className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600">
                  <option>Grok 4 Fast (Reasoning)</option>
                  <option>Grok 3</option>
                  <option>Grok 4 Fast (Non-Reasoning)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">Temperature</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  defaultValue="0.7"
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600"
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">Max Tokens</label>
                <input
                  type="number"
                  defaultValue="2000"
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600"
                />
              </div>
            </div>
          </div>

          {/* Database Configuration */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-xl mb-6">Database Configuration</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Connection String</label>
                <input
                  type="text"
                  value="postgresql://user:pass@localhost:5432/grok_sdr"
                  readOnly
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600 font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-800 rounded-lg">
                  <p className="text-sm text-neutral-400 mb-1">Total Leads</p>
                  <p className="text-2xl">247</p>
                </div>
                <div className="p-4 bg-neutral-800 rounded-lg">
                  <p className="text-sm text-neutral-400 mb-1">Conversations</p>
                  <p className="text-2xl">1,342</p>
                </div>
              </div>

              <button className="w-full px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
                Backup Database
              </button>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-lg mb-4">Score Preview</h2>
            <p className="text-sm text-neutral-400 mb-4">
              Preview how a sample lead would be scored with current criteria
            </p>

            <div className="mb-4 p-4 bg-neutral-800 rounded-lg">
              <p className="text-sm text-neutral-500 mb-2">Sample: Acme Corporation</p>
              <div className="flex items-center justify-center mb-4">
                <div className="text-5xl text-green-500">92</div>
              </div>
            </div>

            <div className="space-y-3">
              {scoringCriteria.filter(c => c.enabled).map((criteria) => (
                <div key={criteria.id} className="text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-neutral-400">{criteria.name}</span>
                    <span>
                      {Math.floor(85 + Math.random() * 15)} × {criteria.weight}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-lg mb-4">Pipeline Stages</h2>
            
            <div className="space-y-2">
              {['New', 'Contacted', 'Qualified', 'Proposal', 'Closed', 'Lost'].map((stage) => (
                <div key={stage} className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg">
                  <span>{stage}</span>
                  <input
                    type="checkbox"
                    defaultChecked={stage !== 'Lost'}
                    className="w-4 h-4 rounded border-neutral-600 bg-neutral-700"
                  />
                </div>
              ))}
            </div>

            <button className="w-full mt-4 px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
              Customize Stages
            </button>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-lg mb-4">Conversation Search</h2>
            <p className="text-sm text-neutral-400 mb-4">
              Search and retrieve previous conversations and company metadata
            </p>
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600 mb-3"
            />
            <button className="w-full px-4 py-2 bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors">
              Advanced Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
