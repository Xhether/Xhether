import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, GripVertical, Loader2, CheckCircle } from 'lucide-react';

interface ScoringCriterion {
  id: string;
  name: string;
  weight: number;
  enabled: boolean;
}

const SETTINGS_KEY = 'app_settings';

export function SettingsView() {
  const [scoringCriteria, setScoringCriteria] = useState<ScoringCriterion[]>([
    { id: '1', name: 'Company Size', weight: 30, enabled: true },
    { id: '2', name: 'Industry Match', weight: 25, enabled: true },
    { id: '3', name: 'Engagement Level', weight: 20, enabled: true },
    { id: '4', name: 'Budget Fit', weight: 15, enabled: true },
    { id: '5', name: 'Timeline', weight: 10, enabled: true },
  ]);
  const [defaultModel, setDefaultModel] = useState('grok-4-fast-reasoning');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2000);
  const [apiKey, setApiKey] = useState('');
  const [totalLeads, setTotalLeads] = useState(0);
  const [totalActivities, setTotalActivities] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setScoringCriteria(settings.scoringCriteria || []);
      setDefaultModel(settings.defaultModel || 'grok-4-fast-reasoning');
      setTemperature(settings.temperature || 0.7);
      setMaxTokens(settings.maxTokens || 2000);
    }
  }, []);

  // Fetch real stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        // Total leads from /dashboard (or /leads count)
        const dashboardRes = await fetch('http://localhost:8000/dashboard');
        if (dashboardRes.ok) {
          const data = await dashboardRes.json();
          setTotalLeads(data.metrics.total_leads || 0);
        }

        // Total activities
        const activitiesRes = await fetch('http://localhost:8000/activities', {  // Assuming endpoint for activities
          method: 'GET',
        });
        if (activitiesRes.ok) {
          const data = await activitiesRes.json();
          setTotalActivities(data.length || 0);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  // Save to localStorage on change
  const saveSettings = () => {
    const settings = {
      scoringCriteria,
      defaultModel,
      temperature,
      maxTokens,
    };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  };

  const handleWeightChange = (id: string, newWeight: number) => {
    setScoringCriteria(prev =>
      prev.map(criteria =>
        criteria.id === id ? { ...criteria, weight: newWeight } : criteria
      )
    );
    saveSettings();
  };

  const handleToggle = (id: string) => {
    setScoringCriteria(prev =>
      prev.map(criteria =>
        criteria.id === id ? { ...criteria, enabled: !criteria.enabled } : criteria
      )
    );
    saveSettings();
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDefaultModel(e.target.value);
    saveSettings();
  };

  const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemperature(parseFloat(e.target.value));
    saveSettings();
  };

  const handleMaxTokensChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxTokens(parseInt(e.target.value));
    saveSettings();
  };

  const totalWeight = scoringCriteria
    .filter(c => c.enabled)
    .reduce((sum, c) => sum + c.weight, 0);

  if (loadingStats) {
    return <div className="p-8 flex items-center justify-center text-white"><Loader2 className="w-6 h-6 animate-spin mr-2" />Loading stats...</div>;
  }

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
                  className={`p-4 bg-neutral-800 rounded-lg transition-opacity ${!criteria.enabled && 'opacity-50'
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
              <button
                onClick={saveSettings}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors"
              >
                <Save className="w-5 h-5" />
                Save Scoring Criteria
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
                  value="xai-••••••••••••••••"  // Placeholder - warn about .env
                  readOnly
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600"
                />
                <p className="text-xs text-yellow-500 mt-1">API key stored securely in .env - restart backend to update</p>
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">Default Model</label>
                <select
                  value={defaultModel}
                  onChange={handleModelChange}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600"
                >
                  <option value="grok-4-fast-reasoning">Grok 4 Fast (Reasoning)</option>
                  <option value="grok-3">Grok 3</option>
                  <option value="grok-4-fast-non-reasoning">Grok 4 Fast (Non-Reasoning)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">Temperature</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={temperature}
                    onChange={handleTemperatureChange}
                    className="flex-1 h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm w-12 text-right">{temperature}</span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">0.0 = deterministic, 1.0 = creative</p>
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">Max Tokens</label>
                <input
                  type="number"
                  value={maxTokens}
                  onChange={handleMaxTokensChange}
                  min="100"
                  max="4000"
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600"
                />
                <p className="text-xs text-neutral-500 mt-1">Maximum response length</p>
              </div>
            </div>

            <button
              onClick={saveSettings}
              className="w-full mt-4 px-4 py-2 bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors"
            >
              Save API Settings
            </button>
          </div>

          {/* Database Configuration */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-xl mb-6">Database Configuration</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Connection Status</label>
                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-green-500">Connected to Supabase</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-800 rounded-lg">
                  <p className="text-sm text-neutral-400 mb-1">Total Leads</p>
                  <p className="text-2xl">{totalLeads}</p>
                </div>
                <div className="p-4 bg-neutral-800 rounded-lg">
                  <p className="text-sm text-neutral-400 mb-1">Total Activities</p>
                  <p className="text-2xl">{totalActivities}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">Sync Status</label>
                <div className="flex items-center gap-2 p-3 bg-neutral-800 rounded-lg">
                  <span className="text-green-500">✓ Synced</span>
                  <span className="text-xs text-neutral-500">Last sync: 2 min ago</span>
                </div>
              </div>
            </div>

            <button className="w-full mt-4 px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
              Refresh Database Stats
            </button>
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
