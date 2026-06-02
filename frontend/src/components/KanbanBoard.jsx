import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { GripHorizontal, CheckCircle2, Clock, Zap } from 'lucide-react';

const statusStyles = {
  applied: 'bg-slate-800/50 border-cyan-500/30 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10',
  reviewing: 'bg-slate-800/50 border-sky-500/30 hover:border-sky-500/50 hover:shadow-lg hover:shadow-sky-500/10',
  shortlisted: 'bg-slate-800/50 border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10',
  interviewed: 'bg-slate-800/50 border-violet-500/30 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/10',
  offered: 'bg-slate-800/50 border-lime-500/30 hover:border-lime-500/50 hover:shadow-lg hover:shadow-lime-500/10',
  rejected: 'bg-slate-800/50 border-rose-500/30 hover:border-rose-500/50 hover:shadow-lg hover:shadow-rose-500/10',
};

const statusBadgeStyles = {
  applied: 'bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-500/20',
  reviewing: 'bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/20',
  shortlisted: 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20',
  interviewed: 'bg-violet-500/10 text-violet-300 ring-1 ring-violet-500/20',
  offered: 'bg-lime-500/10 text-lime-300 ring-1 ring-lime-500/20',
  rejected: 'bg-rose-500/10 text-rose-300 ring-1 ring-rose-500/20',
};

const statusLabels = {
  applied: 'Applied',
  reviewing: 'Reviewing',
  shortlisted: 'Shortlisted',
  interviewed: 'Interviewed',
  offered: 'Offered',
  rejected: 'Rejected',
};

const statusIcons = {
  applied: Clock,
  reviewing: Zap,
  shortlisted: CheckCircle2,
  interviewed: Zap,
  offered: CheckCircle2,
  rejected: Clock,
};

const KanbanBoard = ({ columns, selectedApplicationId, onSelectApplication }) => {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
      {columns.map((column) => {
        const StatusIcon = statusIcons[column.id];
        return (
          <div key={column.id} className="rounded-[2rem] border border-slate-800/60 bg-slate-950/50 p-4 shadow-xl shadow-slate-950/20 backdrop-blur-sm hover:border-slate-700/80 transition">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <StatusIcon size={18} className="text-slate-400" />
                <div>
                  <h4 className="text-lg font-bold text-white">{statusLabels[column.id]}</h4>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{column.items.length} candidates</p>
                </div>
              </div>
              <span className={`rounded-full ${statusBadgeStyles[column.id]} px-3 py-1 text-xs font-bold text-center min-w-fit`}>
                {column.items.length}
              </span>
            </div>
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    aria-live="polite"
                    className={`min-h-[300px] rounded-[1.5rem] p-3 transition duration-300 ${snapshot.isDraggingOver ? 'bg-slate-900/80 ring-2 ring-cyan-500/40 shadow-lg' : 'bg-slate-900/30'}`}>
                  {column.items.length > 0 ? column.items.map((application, index) => (
                    <Draggable key={application._id} draggableId={application._id} index={index}>
                      {(dragProvided, dragSnapshot) => (
                        <div
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          className={`mb-3 rounded-[1.25rem] border-2 p-4 transition duration-300 ${statusStyles[column.id]} ${selectedApplicationId === application._id ? 'ring-2 ring-cyan-300/70 border-cyan-400/60' : ''} ${dragSnapshot.isDragging ? 'shadow-2xl shadow-cyan-500/30 scale-105 rotate-2' : 'scale-100 rotate-0'}`}
                          role="button"
                          tabIndex={0}
                          onClick={() => onSelectApplication?.(application._id)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              onSelectApplication?.(application._id);
                            }
                          }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  aria-label="Drag candidate"
                                  className="flex-shrink-0 rounded-full p-1 text-slate-600 transition hover:bg-slate-800 hover:text-slate-300"
                                  {...dragProvided.dragHandleProps}
                                >
                                  <GripHorizontal size={14} />
                                </button>
                                <h5 className="text-base font-bold text-slate-100 truncate">{application.applicant?.name || 'Candidate'}</h5>
                              </div>
                              <p className="mt-1 text-xs text-slate-400 line-clamp-2">{application.job?.title || 'Role'} • {application.job?.company || 'Company'}</p>
                            </div>
                            <div className={`rounded-lg ${statusBadgeStyles[column.id]} px-2 py-1 text-[11px] font-bold uppercase tracking-wide flex-shrink-0`}>
                              {statusLabels[application.status] || application.status}
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between gap-2 text-xs text-slate-400 border-t border-slate-700/50 pt-2">
                            <span className="truncate">{application.applicant?.email || 'no-email'}</span>
                            {application.aiAnalysis?.score && (
                              <span className="rounded-full bg-slate-700/40 px-2 py-0.5 font-semibold text-slate-200 flex-shrink-0">
                                ⭐ {application.aiAnalysis.score}%
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  )) : (
                    <div className="rounded-[1.25rem] border-2 border-dashed border-slate-700/50 p-6 text-center min-h-[260px] flex items-center justify-center bg-gradient-to-br from-slate-900/70 to-slate-950/50">
                      <div className="animate-pulse text-slate-500">
                        <p className="text-slate-400 text-sm">Drop candidates here</p>
                      </div>
                    </div>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
