import { useState } from 'react';
import { BarChart3, Clock, CheckCircle, AlertCircle, TrendingUp, Play } from 'lucide-react';

export function ModelEvaluation() {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const models = [
    {
      id: 'grok-3',
      name: 'Grok 3',
      accuracy: 94.2,
      avgResponseTime: 1.2,
      qualityScore: 92,
      failureRate: 2.1,
      totalTests: 1247,
    },
    {
      id: 'grok-4-fast-reasoning',
      name: 'Grok 4 Fast (Reasoning)',
      accuracy: 96.8,
      avgResponseTime: 0.8,
      qualityScore: 95,
      failureRate: 1.2,
      totalTests: 1247,
    },
    {
      id: 'grok-4-fast-non-reasoning',
      name: 'Grok 4 Fast (Non-Reasoning)',
      accuracy: 91.5,
      avgResponseTime: 0.5,
      qualityScore: 88,
      failureRate: 3.8,
      totalTests: 1247,
    },
  ];

  const testCategories = [
    { name: 'Lead Qualification', grok3: 92, grok4Reasoning: 95, grok4NonReasoning: 89 },
    { name: 'Message Generation', grok3: 94, grok4Reasoning: 97, grok4NonReasoning: 91 },
    { name: 'Sentiment Analysis', grok3: 96, grok4Reasoning: 98, grok4NonReasoning: 93 },
    { name: 'Meeting Scheduling', grok3: 93, grok4Reasoning: 96, grok4NonReasoning: 90 },
    { name: 'Data Extraction', grok3: 95, grok4Reasoning: 97, grok4NonReasoning: 94 },
  ];

  const failures = [
    {
      model: 'Grok 3',
      category: 'Lead Qualification',
      issue: 'Incorrectly classified mid-market company as enterprise',
      timestamp: '2 hours ago',
    },
    {
      model: 'Grok 4 Fast (Non-Reasoning)',
      category: 'Message Generation',
      issue: 'Generated message was too formal for casual industry',
      timestamp: '5 hours ago',
    },
    {
      model: 'Grok 4 Fast (Non-Reasoning)',
      category: 'Sentiment Analysis',
      issue: 'Misidentified neutral response as negative',
      timestamp: '1 day ago',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl">Model Evaluation</h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors">
            <Play className="w-5 h-5" />
            Run New Evaluation
          </button>
        </div>
        <p className="text-neutral-400">Compare Grok model performance across key metrics</p>
      </div>

      {/* Model Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {models.map((model) => (
          <div
            key={model.id}
            onClick={() => setSelectedModel(model.id)}
            className={`bg-neutral-900 border rounded-xl p-6 cursor-pointer transition-all ${
              selectedModel === model.id
                ? 'border-white'
                : 'border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl">{model.name}</h3>
              {model.accuracy > 95 && (
                <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full border border-green-500/20">
                  Recommended
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-400">Accuracy</span>
                <span className="text-green-500">{model.accuracy}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-400">Avg Response Time</span>
                <span>{model.avgResponseTime}s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-400">Quality Score</span>
                <span>{model.qualityScore}/100</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-400">Failure Rate</span>
                <span className="text-orange-500">{model.failureRate}%</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-800">
              <p className="text-xs text-neutral-500">{model.totalTests} test cases</p>
            </div>
          </div>
        ))}
      </div>

      {/* Performance by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 className="text-xl mb-6">Performance by Category</h2>
          <div className="space-y-6">
            {testCategories.map((category) => (
              <div key={category.name}>
                <p className="text-sm text-neutral-400 mb-3">{category.name}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-neutral-500 w-24">Grok 3</span>
                    <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${category.grok3}%` }}
                      />
                    </div>
                    <span className="text-sm w-12 text-right">{category.grok3}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-neutral-500 w-24">G4 Reasoning</span>
                    <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${category.grok4Reasoning}%` }}
                      />
                    </div>
                    <span className="text-sm w-12 text-right">{category.grok4Reasoning}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-neutral-500 w-24">G4 Non-Reas</span>
                    <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500"
                        style={{ width: `${category.grok4NonReasoning}%` }}
                      />
                    </div>
                    <span className="text-sm w-12 text-right">{category.grok4NonReasoning}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Failures */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 className="text-xl mb-6">Qualitative Analysis - Recent Failures</h2>
          <div className="space-y-4">
            {failures.map((failure, index) => (
              <div key={index} className="p-4 bg-neutral-800 rounded-lg">
                <div className="flex items-start gap-3 mb-2">
                  <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-neutral-300">{failure.model}</span>
                      <span className="text-xs text-neutral-500">{failure.timestamp}</span>
                    </div>
                    <p className="text-sm text-neutral-400 mb-1">{failure.category}</p>
                    <p className="text-sm text-neutral-300">{failure.issue}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <h3 className="text-sm mb-2">Recommendations</h3>
            <ul className="text-sm text-neutral-300 space-y-1">
              <li>• Use Grok 4 Fast (Reasoning) for lead qualification tasks</li>
              <li>• Optimize prompts for industry-specific tone matching</li>
              <li>• Add confidence thresholds for sentiment analysis</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Evaluation Dataset */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl">Evaluation Dataset</h2>
          <button className="px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
            View Full Dataset
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-neutral-800 rounded-lg">
            <p className="text-sm text-neutral-400 mb-1">Total Test Cases</p>
            <p className="text-2xl">1,247</p>
          </div>
          <div className="p-4 bg-neutral-800 rounded-lg">
            <p className="text-sm text-neutral-400 mb-1">Lead Profiles</p>
            <p className="text-2xl">423</p>
          </div>
          <div className="p-4 bg-neutral-800 rounded-lg">
            <p className="text-sm text-neutral-400 mb-1">Message Templates</p>
            <p className="text-2xl">156</p>
          </div>
          <div className="p-4 bg-neutral-800 rounded-lg">
            <p className="text-sm text-neutral-400 mb-1">Conversation Flows</p>
            <p className="text-2xl">89</p>
          </div>
        </div>
      </div>
    </div>
  );
}
