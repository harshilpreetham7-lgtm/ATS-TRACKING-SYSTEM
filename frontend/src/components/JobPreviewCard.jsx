import React from 'react';

const JobPreviewCard = ({ job }) => {
  const jobTypeLabel = job?.type || 'Full-time';
  const roleData = job?.roleData || {
    title: job?.title || 'Choose a role',
    summary: job?.description || 'Select a role to see the hiring scope, required data, and workflow guidance.',
    engagement: jobTypeLabel,
    level: 'Mid-level',
    department: 'Product Engineering',
    skills: ['React', 'JavaScript', 'API integration'],
    submit: ['Resume', 'Contact details', 'Portfolio link', 'Availability'],
  };

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
              {jobTypeLabel} role
            </div>
          </div>
          <p className="text-sm leading-6 text-slate-300">{roleData.summary}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-900/80 p-4 ring-1 ring-white/10">
              <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Role snapshot</p>
              <p className="mt-3 text-sm text-slate-200">{roleData.department} • {roleData.level} • {roleData.engagement}</p>
            </div>
            <div className="rounded-3xl bg-slate-900/80 p-4 ring-1 ring-white/10">
              <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Top skills</p>
              <p className="mt-3 text-sm text-slate-200">{roleData.skills.join(' • ')}</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-900/80 p-4 ring-1 ring-white/10">
              <p className="text-xs uppercase tracking-[0.26em] text-slate-400">What to submit</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-200">
                {roleData.submit.map((item) => (
                  <li key={item} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-slate-900/80 p-4 ring-1 ring-white/10">
              <p className="text-xs uppercase tracking-[0.26em] text-slate-400">How selection works</p>
              <p className="mt-3 text-sm text-slate-200">Review required data, score fit, move to shortlist, schedule interviews, and decide on offer or rejection based on stage criteria.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-[1.75rem] border border-slate-800 bg-slate-900/90 p-6 text-slate-400">
          Choose an open role card to preview the hiring details, role type, required data, and workflow guidance.
        </div>
      )}
    </div>
  );
};

export default JobPreviewCard;
