import React from 'react';
import { TrendingUp } from 'lucide-react';

const SummaryCard = ({ title, value, subtitle, accent = 'from-slate-900 via-slate-900 to-slate-950', onClick, active }) => {
  const Wrapper = onClick ? 'button' : 'div';
  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`group relative w-full rounded-[1.8rem] border border-slate-800 bg-slate-900/90 p-6 text-left shadow-sm transition duration-300 ${onClick ? 'cursor-pointer hover:border-slate-700 hover:bg-slate-900' : ''} ${active ? 'ring-2 ring-cyan-400/70 bg-slate-900/95 shadow-md shadow-cyan-500/20' : ''}`}>
      {/* Animated background gradient */}
      <div className={`absolute inset-0 rounded-[1.8rem] bg-gradient-to-br ${accent} opacity-0 transition duration-300 ${onClick ? 'group-hover:opacity-[0.05]' : ''} ${active ? 'opacity-[0.08]' : ''}`} />
      
      {/* Content wrapper */}
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-950/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 ring-1 ring-slate-700/50">
            {title}
          </div>
          {onClick && (
            <div className="text-slate-600 transition duration-300 group-hover:text-slate-400">
              <TrendingUp size={16} />
            </div>
          )}
        </div>
        <p className="mt-5 text-3xl font-semibold tracking-tight text-white transition duration-300 group-hover:text-slate-100">{value}</p>
        <p className="mt-3 text-sm leading-6 text-slate-400 transition duration-300 group-hover:text-slate-300">{subtitle}</p>
      </div>

      {/* Animated border */}
      {active && (
        <div className="absolute inset-0 rounded-[1.8rem] border border-cyan-400/60 pointer-events-none" />
      )}
    </Wrapper>
  );
};

export default SummaryCard;
