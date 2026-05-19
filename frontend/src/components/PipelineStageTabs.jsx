import React from 'react';

const PipelineStageTabs = ({ stages, selectedStage, onSelect }) => {
  return (
    <div className="space-y-4 rounded-[2rem] border border-slate-800 bg-slate-950/90 p-6 shadow-2xl shadow-slate-950/20">
      <div className="flex flex-wrap gap-2">
        {stages.map((stage) => (
          <button
            key={stage.id}
            type="button"
            onClick={() => onSelect(stage.id)}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition ${selectedStage === stage.id ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}>
            {stage.title}
          </button>
        ))}
      </div>
      <div className="rounded-[1.75rem] bg-slate-900/80 p-5 text-slate-300 ring-1 ring-white/10">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Current stage</p>
        <p className="mt-4 text-sm leading-6 text-slate-300">{stages.find((stage) => stage.id === selectedStage)?.description}</p>
      </div>
    </div>
  );
};

export default PipelineStageTabs;
