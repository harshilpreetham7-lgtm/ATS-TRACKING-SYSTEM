import React from 'react';
import { TrendingUp } from 'lucide-react';

const SummaryCard = ({ title, value, subtitle, accent = 'from-slate-500 to-slate-700', onClick, active }) => {
  const Wrapper = onClick ? 'button' : 'div';
  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`group relative w-full rounded-[1.6rem] border border-slate-800/70 bg-slate-900/90 p-5 text-left shadow-lg shadow-slate-950/20 transition duration-300 hover:shadow-slate-950/30 ${onClick ? 'cursor-pointer hover:-translate-y-1 hover:border-slate-600' : ''} ${active ? 'ring-1 ring-cyan-400/70 bg-slate-900/95' : ''}`}>
      {/* Animated background gradient */}
      <div className={`absolute inset-0 rounded-[1.6rem] bg-gradient-to-br ${accent} opacity-0 transition duration-300 ${onClick ? 'group-hover:opacity-[0.05]' : ''} ${active ? 'opacity-[0.08]' : ''}`} />
      
      {/* Content wrapper */}
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-950/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-200 ring-1 ring-white/10">
            {title}
          </div>
          {onClick && (
            <div className="text-slate-500 transition duration-300 group-hover:text-slate-300">
              <TrendingUp size={16} />
            </div>
          )}
        </div>
        <p className="mt-4 text-3xl font-semibold tracking-tight text-white transition duration-300">{value}</p>
        <p className="mt-3 text-sm leading-6 text-slate-400 transition duration-300">{subtitle}</p>
      </div>

      {/* Animated border */}
      {active && (
        <div className="absolute inset-0 rounded-[1.6rem] border border-cyan-400/40 pointer-events-none" />
      )}
    </Wrapper>
  );
};

export default SummaryCard;
