import React from 'react';

const PipelineStageTabs = ({ stages, selectedStage, onSelect }) => {
  const selected = stages.find((stage) => stage.id === selectedStage);

  return (
    <div className="space-y-4 rounded-[2rem] border border-slate-800 bg-slate-950/90 p-6 shadow-2xl shadow-slate-950/20">
      <div className="flex flex-wrap gap-2">
        {stages.map((stage) => (
          <button
            key={stage.id}
            type="button"
            onClick={() => onSelect(stage.id)}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition ${selectedStage === stage.id ? 'bg-slate-200 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}>
            {stage.title}
          </button>
        ))}
      </div>
      <div className="rounded-[1.75rem] bg-slate-900/80 p-5 text-slate-300 ring-1 ring-white/10">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Current stage</p>
        <p className="mt-4 text-sm leading-6 text-slate-300">{selected?.description}</p>
        {selected?.criteria?.length ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-950/70 p-4 ring-1 ring-white/5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Goal</p>
              <p className="mt-2 text-sm text-slate-200">{selected.goal}</p>
            </div>
            <div className="rounded-3xl bg-slate-950/70 p-4 ring-1 ring-white/5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Output</p>
              <p className="mt-2 text-sm text-slate-200">{selected.output}</p>
            </div>
          </div>
        ) : null}
        {selected?.criteria?.length ? (
          <div className="mt-5 rounded-3xl bg-slate-950/70 p-4 ring-1 ring-white/5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Checklist</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {selected.criteria.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PipelineStageTabs;
