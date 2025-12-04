export function PipelineOverview() {
  const stages = [
    { name: 'New', count: 78, color: 'bg-blue-500' },
    { name: 'Contacted', count: 56, color: 'bg-purple-500' },
    { name: 'Qualified', count: 42, color: 'bg-yellow-500' },
    { name: 'Proposal', count: 28, color: 'bg-orange-500' },
    { name: 'Closed', count: 43, color: 'bg-green-500' },
  ];

  const total = stages.reduce((sum, stage) => sum + stage.count, 0);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <h2 className="text-xl mb-6">Pipeline Overview</h2>
      
      <div className="space-y-4">
        {stages.map((stage) => (
          <div key={stage.name}>
            <div className="flex justify-between mb-2">
              <span className="text-neutral-300">{stage.name}</span>
              <span className="text-neutral-400">{stage.count} leads</span>
            </div>
            <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${stage.color} transition-all duration-500`}
                style={{ width: `${(stage.count / total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-neutral-800">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">Total Pipeline Value</span>
          <span>$2.4M</span>
        </div>
      </div>
    </div>
  );
}
