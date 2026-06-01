import React from 'react';

const SectionHeader = ({ eyebrow, title, description, badge }) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.32em] text-slate-400">{eyebrow}</p>
        <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
        <p className="mt-4 max-w-2xl text-slate-400 leading-7">{description}</p>
      </div>
      {badge ? (
        <div className="rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-200">
          {badge}
        </div>
      ) : null}
    </div>
  );
};

export default SectionHeader;
