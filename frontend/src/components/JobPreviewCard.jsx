import React from 'react';

const JobPreviewCard = ({ job }) => {
  return (
    <div className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-6 shadow-2xl shadow-slate-950/20">
      <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Selected role</p>
      {job ? (
        <div className="mt-5 space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-white">{job.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{job.company || 'Top-tier team'} • {job.location || 'Remote'}</p>
            </div>
            <div className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-slate-300 ring-1 ring-white/10">
              {job.type || 'Full-time'} role
            </div>
          </div>
          <p className="text-sm leading-6 text-slate-300">{job.description || 'This role is currently open and ready to receive qualified candidates through your hiring pipeline.'}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-900/80 p-4 ring-1 ring-white/10">
              <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Hiring highlight</p>
              <p className="mt-3 text-sm text-slate-200">Keep the candidate flow moving fast with real-time updates and human-friendly status tracking.</p>
            </div>
            <div className="rounded-3xl bg-slate-900/80 p-4 ring-1 ring-white/10">
              <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Team focus</p>
              <p className="mt-3 text-sm text-slate-200">Align stakeholders quickly around priority roles and surface the strongest candidates instantly.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-[1.75rem] border border-slate-800 bg-slate-900/90 p-6 text-slate-400">
          Choose an open role card to preview the hiring details and workflow guidance.
        </div>
      )}
    </div>
  );
};

export default JobPreviewCard;
