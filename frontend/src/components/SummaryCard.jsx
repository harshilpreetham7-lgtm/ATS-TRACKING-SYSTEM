import React from 'react';
import { TrendingUp } from 'lucide-react';

const SummaryCard = ({ title, value, subtitle, accent = 'from-indigo-500 via-purple-500 to-blue-500', onClick, active }) => {
  const Wrapper = onClick ? 'button' : 'div';
  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`group relative w-full rounded-[1.8rem] border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-950/90 p-6 text-left shadow-2xl shadow-slate-950/20 transition duration-300 hover:shadow-indigo-500/10 ${onClick ? 'cursor-pointer hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/20' : ''} ${active ? 'ring-2 ring-indigo-500/80 bg-slate-900/90 shadow-lg shadow-indigo-500/30' : ''}`}>
      {/* Animated background gradient */}
      <div className={`absolute inset-0 rounded-[1.8rem] bg-gradient-to-br ${accent} opacity-0 transition duration-300 ${onClick ? 'group-hover:opacity-[0.07]' : ''} ${active ? 'opacity-[0.12]' : ''}`} />
      
      {/* Content wrapper */}
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-300 ring-1 ring-indigo-500/20">
            {title}
          </div>
          {onClick && (
            <div className="text-slate-600 transition duration-300 group-hover:text-indigo-400/70">
              <TrendingUp size={16} />
            </div>
          )}
        </div>
        <p className="mt-5 text-4xl font-black tracking-tight text-white transition duration-300 group-hover:text-indigo-100">{value}</p>
        <p className="mt-3 text-sm leading-6 text-slate-400 transition duration-300 group-hover:text-slate-300">{subtitle}</p>
      </div>

      {/* Animated border */}
      {active && (
        <div className="absolute inset-0 rounded-[1.8rem] animate-pulse border border-indigo-500/50 pointer-events-none" />
      )}
    </Wrapper>
  );
};

export default SummaryCard;
