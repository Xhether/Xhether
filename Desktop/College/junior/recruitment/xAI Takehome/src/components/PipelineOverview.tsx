interface PipelineStage {
  name: string;
  count: number;
}

interface PipelineOverviewProps {
  data?: PipelineStage[];
}

export function PipelineOverview({ data }: PipelineOverviewProps) {
  const defaultStages = [
    { name: 'new', count: 0 },
    { name: 'contacted', count: 0 },
    { name: 'qualified', count: 0 },
    { name: 'proposal', count: 0 },
    { name: 'closed', count: 0 },
  ];

  const stagesData = data || defaultStages;

  const stages = stagesData.map(stage => ({
    ...stage,
    // Map simplified backend names to UI colors
    color: getStageColor(stage.name)
  }));

  const total = stages.reduce((sum, stage) => sum + stage.count, 0);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <h2 className="text-xl mb-6">Pipeline Overview</h2>

      <div className="space-y-4">
        {stages.map((stage) => (
          <div key={stage.name}>
            <div className="flex justify-between mb-2">
              <span className="text-neutral-300 capitalize">{stage.name}</span>
              <span className="text-neutral-400">{stage.count} leads</span>
            </div>
            <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${stage.color} transition-all duration-500`}
                style={{ width: total > 0 ? `${(stage.count / total) * 100}%` : '0%' }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-neutral-800">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">Total Pipeline Value</span>
          <span>--</span>
        </div>
      </div>
    </div>
  );
}

function getStageColor(name: string): string {
  switch (name.toLowerCase()) {
    case 'new': return 'bg-blue-500';
    case 'contacted': return 'bg-purple-500';
    case 'qualified': return 'bg-yellow-500';
    case 'proposal': return 'bg-orange-500';
    case 'closed': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
}

