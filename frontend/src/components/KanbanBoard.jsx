import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { GripHorizontal, CheckCircle2, Clock, Zap } from 'lucide-react';

const statusStyles = {
  applied: 'bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:shadow-lg hover:shadow-slate-600/10',
  reviewing: 'bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:shadow-lg hover:shadow-slate-600/10',
  shortlisted: 'bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:shadow-lg hover:shadow-slate-600/10',
  interviewed: 'bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:shadow-lg hover:shadow-slate-600/10',
  offered: 'bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:shadow-lg hover:shadow-slate-600/10',
  rejected: 'bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:shadow-lg hover:shadow-slate-600/10',
};

const statusBadgeStyles = {
  applied: 'bg-slate-900 text-slate-400 ring-1 ring-slate-700',
  reviewing: 'bg-slate-900 text-slate-400 ring-1 ring-slate-700',
  shortlisted: 'bg-slate-900 text-slate-400 ring-1 ring-slate-700',
  interviewed: 'bg-slate-900 text-slate-400 ring-1 ring-slate-700',
  offered: 'bg-slate-900 text-slate-400 ring-1 ring-slate-700',
  rejected: 'bg-slate-900 text-slate-400 ring-1 ring-slate-700',
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
                    className={`min-h-[300px] rounded-[1.5rem] p-3 transition duration-300 ${snapshot.isDraggingOver ? 'bg-slate-900/80 ring-2 ring-slate-500/40 shadow-lg' : 'bg-slate-900/30'}`}>
                  {column.items.length > 0 ? column.items.map((application, index) => (
                    <Draggable key={application._id} draggableId={application._id} index={index}>
                      {(dragProvided, dragSnapshot) => (
                        <div
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          className={`mb-3 rounded-[1.25rem] border-2 p-4 transition duration-300 ${statusStyles[column.id]} ${selectedApplicationId === application._id ? 'ring-2 ring-slate-500/70 border-slate-600/60' : ''} ${dragSnapshot.isDragging ? 'shadow-2xl shadow-slate-600/30 scale-101' : 'scale-100'}`}
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
