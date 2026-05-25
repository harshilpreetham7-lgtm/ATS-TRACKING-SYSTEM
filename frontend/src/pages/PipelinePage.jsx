import { useEffect, useMemo, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import NavBar from '../components/NavBar';
import PipelineStageTabs from '../components/PipelineStageTabs';
import KanbanBoard from '../components/KanbanBoard';
import SummaryCard from '../components/SummaryCard';
import { useAppStore } from '../store/useAppStore';

const statusColumns = [
  { id: 'applied', title: 'Applied' },
  { id: 'reviewing', title: 'Reviewing' },
  { id: 'shortlisted', title: 'Shortlisted' },
  { id: 'interviewed', title: 'Interviewed' },
  { id: 'offered', title: 'Offered' },
  { id: 'rejected', title: 'Rejected' },
];

const stageDefinitions = [
  { id: 'applied', title: 'Applied', description: 'New candidates enter here.', goal: 'Validate role match.', output: 'Complete first-pass screen.', criteria: ['Resume present', 'Role fit identified', 'Contact details captured'] },
  { id: 'reviewing', title: 'Reviewing', description: 'Screen against the scorecard.', goal: 'Decide shortlist or hold.', output: 'Review notes and risk flags.', criteria: ['Scorecard complete', 'Compensation fit checked', 'Manager feedback collected'] },
  { id: 'shortlisted', title: 'Shortlisted', description: 'Prepare for interviews.', goal: 'Lock interview plan.', output: 'Panel and rubric.', criteria: ['Panel selected', 'Slots scheduled', 'Questions assigned'] },
  { id: 'interviewed', title: 'Interviewed', description: 'Collect feedback and decide.', goal: 'Convert feedback to decision.', output: 'Hiring recommendation.', criteria: ['Scorecards submitted', 'Debrief completed'] },
  { id: 'offered', title: 'Offered', description: 'Send and track the offer.', goal: 'Close the candidate.', output: 'Offer package.', criteria: ['Offer approved', 'Start date confirmed'] },
  { id: 'rejected', title: 'Rejected', description: 'Close out professionally.', goal: 'Keep the pipeline clean.', output: 'Rejection reason and notes.', criteria: ['Reason recorded', 'Candidate notified'] },
];

const PipelinePage = () => {
  const { user, logout, loadBoard, applications, updateApplicationStatus, jobs } = useAppStore();
  const [selectedStage, setSelectedStage] = useState('applied');

  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  const totalApplications = applications.length;
  const totalJobs = jobs.length;
  const conversionRate = totalApplications ? Math.round((applications.filter((app) => app.status === 'offered').length / totalApplications) * 100) : 0;

  const columns = useMemo(
    () => statusColumns.map((column) => ({ ...column, items: applications.filter((app) => app.status === column.id) })),
    [applications]
  );

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;
    await updateApplicationStatus(draggableId, destination.droppableId);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar user={user} onLogout={logout} onSync={loadBoard} />
      <main className="mx-auto max-w-[1440px] px-4 pb-10 pt-4 sm:px-6 lg:px-8 lg:pb-12 lg:pt-5">
        <section className="rounded-[2rem] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 shadow-2xl shadow-slate-950/30 ring-1 ring-white/5 lg:p-7">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Pipeline workspace</p>
              <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">A dedicated page for candidate movement and stage tracking.</h1>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
                The board, stage descriptions, and hiring decisions live here so the dashboard stays clean and the workflow stays professional.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SummaryCard title="Open roles" value={totalJobs} subtitle="Active jobs in the pipeline." />
            <SummaryCard title="Live pipeline" value={totalApplications} subtitle="Candidates moving through stages." />
            <SummaryCard title="Offer conversion" value={`${conversionRate}%`} subtitle="Offers from the current pipeline." />
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-5 shadow-2xl shadow-slate-950/24 ring-1 ring-white/5 lg:p-6">
          <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-5 shadow-lg shadow-slate-950/20">
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Pipeline board</p>
              <div className="mt-5">
                <DragDropContext onDragEnd={handleDragEnd}>
                  <KanbanBoard columns={columns} />
                </DragDropContext>
              </div>
            </div>
            <div className="space-y-6">
              <PipelineStageTabs stages={stageDefinitions} selectedStage={selectedStage} onSelect={setSelectedStage} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PipelinePage;