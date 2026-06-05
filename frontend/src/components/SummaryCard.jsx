import React from 'react';
import { TrendingUp } from 'lucide-react';

const SummaryCard = ({ title, value, subtitle, accent = 'from-indigo-500 via-rose-500 to-emerald-500', onClick, active }) => {
  const Wrapper = onClick ? 'button' : 'div';
  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`group relative w-full rounded-[1.8rem] border border-slate-700/60 bg-gradient-to-br from-slate-900/95 to-slate-950/98 p-6 text-left shadow-2xl shadow-indigo-950/40 transition duration-300 hover:shadow-rose-500/20 ${onClick ? 'cursor-pointer hover:-translate-y-1 hover:border-rose-400/70 hover:shadow-lg hover:shadow-rose-500/30' : ''} ${active ? 'ring-2 ring-emerald-400/80 bg-slate-900/95 shadow-lg shadow-emerald-500/40' : ''}`}>
      {/* Animated background gradient */}
      <div className={`absolute inset-0 rounded-[1.8rem] bg-gradient-to-br ${accent} opacity-0 transition duration-300 ${onClick ? 'group-hover:opacity-[0.08]' : ''} ${active ? 'opacity-[0.14]' : ''}`} />
      
      {/* Content wrapper */}
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-950/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-rose-200 ring-1 ring-rose-500/40">
            {title}
          </div>
          {onClick && (
            <div className="text-slate-600 transition duration-300 group-hover:text-rose-400/90">
              <TrendingUp size={16} />
            </div>
          )}
        </div>
        <p className="mt-5 text-4xl font-black tracking-tight text-white transition duration-300 group-hover:text-rose-100">{value}</p>
        <p className="mt-3 text-sm leading-6 text-slate-400 transition duration-300 group-hover:text-slate-300">{subtitle}</p>
      </div>

      {/* Animated border */}
      {active && (
        <div className="absolute inset-0 rounded-[1.8rem] animate-pulse border border-emerald-400/60 pointer-events-none" />
      )}
    </Wrapper>
  );
};

export default SummaryCard;
