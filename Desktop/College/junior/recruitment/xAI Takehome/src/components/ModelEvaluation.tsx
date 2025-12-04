import { useState, useEffect } from 'react';
import { BarChart3, Clock, CheckCircle, AlertCircle, TrendingUp, Play, AlertTriangle } from 'lucide-react';
import { Progress } from './ui/progress'; // Fixed path: ./ui/ relative to components/
import { getCachedData, setCachedData, clearCache } from '../utils/cache';

interface ModelMetrics {
  accuracy: number;
  failure_rate: number;
  avg_latency: number;
}

interface EvaluationFailure {
  model: string;
  category: string;
  issue: string;
  timestamp: string;
}

const EVALUATION_CACHE_KEY = 'model_evaluation_results';
const CACHE_TTL = 3600; // 1 hour
const ESTIMATED_DURATION = 120; // 2 minutes in seconds for progress simulation

export function ModelEvaluation() {
  const [models, setModels] = useState<ModelMetrics>({});
  const [failures, setFailures] = useState<EvaluationFailure[]>([]);
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);
  const [progress, setProgress] = useState(0);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  // Load from cache on mount
  useEffect(() => {
    const cached = getCachedData<any>(EVALUATION_CACHE_KEY, CACHE_TTL);
    if (cached) {
      setModels(cached.results || {});
      setFailures(cached.failures || []);
      setHasData(true);
    }
  }, []);

  // Cleanup on unmount (cancel ongoing fetch)
  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort(); // Cancels fetch if navigating away
      }
    };
  }, [abortController]);

  const handleRunEvaluation = async () => {
    const controller = new AbortController();
    setAbortController(controller);
    setEvaluating(true);
    setLoading(true);
    setProgress(0);

    // Simulate progress (indeterminate feel with time-based updates)
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + (100 / (ESTIMATED_DURATION / 2)), 90)); // Ramp to 90% over ~1 min
    }, 1000);

    try {
      const response = await fetch('http://localhost:8000/evaluate', {
        method: 'POST',
        signal: controller.signal, // Allows cancellation
      });
      if (!response.ok) throw new Error('Evaluation failed');
      const evaluation = await response.json();

      setProgress(100); // Complete on success

      const modelData: ModelMetrics = {};
      for (const [model, metrics] of Object.entries(evaluation.results || {})) {
        modelData[model] = {
          accuracy: metrics.accuracy,
          failure_rate: metrics.failure_rate,
          avg_latency: metrics.avg_latency,
        };
      }
      setModels(modelData);
      setFailures(evaluation.failures || []);
      setHasData(true);
      setCacheCleared(false);

      // Cache the full results
      setCachedData(EVALUATION_CACHE_KEY, evaluation);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Failed to run evaluation:', error);
        alert('Evaluation failed—check backend logs or API key.');
      }
      setProgress(0);
    } finally {
      clearInterval(progressInterval);
      setEvaluating(false);
      setLoading(false);
      setAbortController(null);
    }
  };

  const handleClearCache = () => {
    clearCache(EVALUATION_CACHE_KEY);
    setModels({});
    setFailures([]);
    setHasData(false);
    setCacheCleared(true);
    setProgress(0);
  };

  // Dynamic recommendation: Best model by accuracy
  const bestModel = Object.entries(models).reduce((best, [modelId, metrics]) =>
    metrics.accuracy > (best[1]?.accuracy || 0) ? [modelId, metrics] : best,
    [] as [string, ModelMetrics]
  );
  const friendlyModelName = (modelId: string) => {
    if (modelId === 'grok-3') return 'Grok 3';
    if (modelId === 'grok-4-fast-reasoning') return 'Grok 4 Fast Reasoning';
    if (modelId === 'grok-4-fast-non-reasoning') return 'Grok 4 Fast Non-Reasoning';
    return modelId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const testCategories = [
    { name: 'Lead Qualification', grok3: 0, grok4reasoning: 0, grok4nonreasoning: 0 },
    { name: 'Message Generation', grok3: 0, grok4reasoning: 0, grok4nonreasoning: 0 },
    { name: 'Sentiment Analysis', grok3: 0, grok4reasoning: 0, grok4nonreasoning: 0 },
    { name: 'Meeting Scheduling', grok3: 0, grok4reasoning: 0, grok4nonreasoning: 0 },
    { name: 'Data Extraction', grok3: 0, grok4reasoning: 0, grok4nonreasoning: 0 },
  ];

  if (!hasData && !loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-neutral-400 mb-4">No evaluation data available yet.</p>
        <button
          onClick={handleRunEvaluation}
          disabled={evaluating}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 mx-auto mb-2"
        >
          {evaluating ? (
            <>
              <Play className="w-5 h-5 animate-spin" />
              Running Evaluation...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Run First Evaluation (3 Models)
            </>
          )}
        </button>
        <p className="text-xs text-neutral-500">This may take 1.5-3 minutes—results cached for 1 hour.</p>
      </div>
    );
  }

  if (loading || evaluating) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <h2 className="text-xl mb-4 text-white">Evaluating Models</h2>
        <p className="text-neutral-400 mb-4">Keep this tab open to avoid interruption—results will cache automatically.</p>
        <div className="w-full max-w-md mb-4">
          <Progress value={progress} className="w-full" />
        </div>
        <p className="text-sm text-neutral-400">
          {progress < 90 ? `${Math.round(progress)}% - Estimated time remaining: ~${Math.round((ESTIMATED_DURATION * (1 - progress / 100)) / 60)} min` : 'Finalizing...'}
        </p>
        <AlertTriangle className="w-5 h-5 text-yellow-500 mt-2" />
        <p className="text-xs text-yellow-500 mt-1">Navigating away may cancel live updates, but the process continues in the background.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl">Model Evaluation</h1>
          <div className="flex gap-2">
            <button
              onClick={handleRunEvaluation}
              disabled={evaluating}
              className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              {evaluating ? (
                <>
                  <Play className="w-5 h-5 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  {cacheCleared ? 'Run Evaluation' : 'Re-run Evaluation'}
                </>
              )}
            </button>
            <button
              onClick={handleClearCache}
              className="px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors text-sm"
            >
              Clear Cache
            </button>
          </div>
        </div>
        <p className="text-neutral-400">Compare Grok variants across key metrics (cached data)</p>
      </div>

      {/* Model Comparison Cards - 3 models */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Object.entries(models).map(([modelId, model]) => (
          <div key={modelId} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 cursor-pointer transition-all hover:border-neutral-700">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl">{friendlyModelName(modelId)}</h3>
              {model.accuracy > 95 && (
                <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full border border-green-500/20">
                  Recommended
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-400">Accuracy</span>
                <span className="text-green-500 font-medium">{model.accuracy.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-400">Avg Response Time</span>
                <span className="font-medium">{model.avg_latency.toFixed(1)}s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-400">API Failure Rate</span>
                <span className={`font-medium ${model.failure_rate === 0 ? 'text-green-500' : 'text-orange-500'}`}>
                  {model.failure_rate.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-800">
              <p className="text-xs text-neutral-500">Test cases: 12 (cached)</p>
            </div>
          </div>
        ))}
      </div>

      {/* Performance by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 className="text-xl mb-6">Performance by Category</h2>
          <p className="text-sm text-neutral-500 mb-4 italic">Using overall accuracy (lead qualification focus—expandable to more categories)</p>
          <div className="space-y-6">
            {testCategories.map((category, index) => (
              <div key={index}>
                <p className="text-sm text-neutral-400 mb-3">{category.name}</p>
                <div className="space-y-2">
                  {Object.entries(models).map(([modelId, model]) => {
                    const score = model.accuracy; // Placeholder: overall for now
                    return (
                      <div key={modelId} className="flex items-center gap-3">
                        <span className="text-xs text-neutral-500 w-40">{friendlyModelName(modelId)}</span>
                        <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500"
                            style={{ width: `${score}%` }}
                          />
                        </div>
                        <span className="text-sm w-12 text-right">{score.toFixed(1)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Accuracy Mismatches */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 className="text-xl mb-2">Recent Accuracy Mismatches</h2>
          <p className="text-xs text-neutral-500 mb-4">Logic errors (e.g., wrong qualification stage)—not API failures.</p>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {failures.length > 0 ? (
              failures.map((failure, index) => (
                <div key={index} className="p-4 bg-neutral-800 rounded-lg">
                  <div className="flex items-start gap-3 mb-2">
                    <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm text-neutral-300">{friendlyModelName(failure.model)}</span>
                        <span className="text-xs text-neutral-500">{new Date(failure.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-neutral-400 mb-1">{failure.category}</p>
                      <p className="text-sm text-neutral-300">{failure.issue}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-neutral-500 italic text-center py-8">No mismatches in recent evaluation—all predictions matched expectations!</p>
            )}
          </div>

          {/* Dynamic Recommendations */}
          {bestModel.length > 0 && (
            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <h3 className="text-sm mb-2 font-medium">Top Recommendation</h3>
              <p className="text-sm text-green-300">
                {friendlyModelName(bestModel[0])} has the highest accuracy ({bestModel[1].accuracy.toFixed(1)}%)—use it for lead qualification tasks.
              </p>
              <ul className="text-xs text-green-200 space-y-1 mt-2 list-disc pl-4">
                <li>Optimize prompts for industry-specific tone</li>
                <li>Add confidence thresholds for edge cases</li>
                <li>Monitor latency for real-time use</li>
              </ul>
            </div>
          )}
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
            <p className="text-2xl">12</p>
          </div>
          <div className="p-4 bg-neutral-800 rounded-lg">
            <p className="text-sm text-neutral-400 mb-1">Models Tested</p>
            <p className="text-2xl">{Object.keys(models).length}</p>
          </div>
          <div className="p-4 bg-neutral-800 rounded-lg">
            <p className="text-sm text-neutral-400 mb-1">API Calls</p>
            <p className="text-2xl">{12 * Object.keys(models).length}</p>
          </div>
          <div className="p-4 bg-neutral-800 rounded-lg">
            <p className="text-sm text-neutral-400 mb-1">Focus</p>
            <p className="text-2xl">Lead Qualification</p>
          </div>
        </div>
      </div>
    </div>
  );
}