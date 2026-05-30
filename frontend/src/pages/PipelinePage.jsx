import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
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

const emptyCandidateDetails = {
  phone: '',
  experienceYears: '',
  noticePeriod: '',
  currentLocation: '',
  expectedCtc: '',
  portfolioUrl: '',
  whyThisRole: '',
};

const emptyReviewDetails = {
  summary: '',
  shortlistedReason: '',
  rejectionReason: '',
};

const emptyInterviewRequest = {
  formLink: '',
  examLink: '',
  interviewer: '',
  interviewDate: '',
  interviewNotes: '',
};

const emptyInterviewResult = {
  score: '',
  feedback: '',
};

const emptyOfferDetails = {
  offerLetterLink: '',
  offerMessage: '',
};

const Field = ({ label, children }) => (
  <label className="block">
    <span className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</span>
    <div className="mt-2">{children}</div>
  </label>
);

const inputClass = 'w-full rounded-xl border border-slate-700/60 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/25';
const textAreaClass = `${inputClass} min-h-[88px] resize-y`;

const PipelinePage = () => {
  const {
    user,
    logout,
    loadBoard,
    applications,
    updateApplicationStatus,
    saveApplicationDetails,
    requestInterview,
    submitInterviewResult,
    jobs,
  } = useAppStore();
  const [selectedStage, setSelectedStage] = useState('applied');
  const [selectedApplicationId, setSelectedApplicationId] = useState('');
  const [candidateDetails, setCandidateDetails] = useState(emptyCandidateDetails);
  const [reviewDetails, setReviewDetails] = useState(emptyReviewDetails);
  const [interviewRequest, setInterviewRequest] = useState(emptyInterviewRequest);
  const [interviewResult, setInterviewResult] = useState(emptyInterviewResult);
  const [offerDetails, setOfferDetails] = useState(emptyOfferDetails);
  const [lastGeneratedLinks, setLastGeneratedLinks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ats_pipeline_last_generated_links') || 'null');
    } catch {
      return null;
    }
  });
  const [copiedLinkHistory, setCopiedLinkHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ats_pipeline_copy_history') || '[]');
    } catch {
      return [];
    }
  });
  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLinkHistory((prev) => {
        const nextHistory = [
        {
          label,
          text,
          copiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        ...prev,
        ].slice(0, 4);
        localStorage.setItem('ats_pipeline_copy_history', JSON.stringify(nextHistory));
        return nextHistory;
      });
      useAppStore.getState().pushNotification({ type: 'success', title: 'Copied', message: 'Link copied to clipboard.' });
    } catch (e) {
      useAppStore.getState().pushNotification({ type: 'error', title: 'Copy failed', message: e.message || 'Could not copy link.' });
    }
  };

  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  useEffect(() => {
    if (!applications.length) {
      setSelectedApplicationId('');
      return;
    }
    const stillExists = applications.some((app) => app._id === selectedApplicationId);
    if (!selectedApplicationId || !stillExists) {
      setSelectedApplicationId(applications[0]._id);
    }
  }, [applications, selectedApplicationId]);

  const selectedApplication = useMemo(
    () => applications.find((app) => app._id === selectedApplicationId) || null,
    [applications, selectedApplicationId]
  );

  useEffect(() => {
    if (!selectedApplication) return;
    const workflow = selectedApplication.workflow || {};
    setSelectedStage(selectedApplication.status || 'applied');
    setCandidateDetails({ ...emptyCandidateDetails, ...(workflow.candidateDetails || {}) });
    setReviewDetails({ ...emptyReviewDetails, ...(workflow.review || {}) });
    setInterviewRequest({ ...emptyInterviewRequest, ...(workflow.interview || {}) });
    setInterviewResult({
      score: workflow.interview?.score ?? '',
      feedback: workflow.interview?.interviewNotes || '',
    });
    setOfferDetails({
      offerLetterLink: workflow.offer?.offerLetterLink || '',
      offerMessage: workflow.offer?.message || '',
    });
  }, [selectedApplication]);

  useEffect(() => {
    if (!selectedApplication || !lastGeneratedLinks) return;
    if (lastGeneratedLinks.applicationId === selectedApplication._id) {
      setInterviewRequest((prev) => ({
        ...prev,
        formLink: prev.formLink || lastGeneratedLinks.formLink || '',
        examLink: prev.examLink || lastGeneratedLinks.examLink || '',
      }));
    }
  }, [selectedApplication, lastGeneratedLinks]);

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

    // helper to reorder items within same column
    const reorderWithin = (items, statusId, fromIndex, toIndex) => {
      const filtered = items.filter((it) => it.status === statusId);
      const item = filtered.splice(fromIndex, 1)[0];
      filtered.splice(toIndex, 0, item);
      // rebuild applications keeping other statuses in same order
      const other = items.filter((it) => it.status !== statusId);
      // merge by keeping order: place filtered items where that status belongs
      // simple approach: remove old items of status and append reordered at end of other preserving relative positions
      const remaining = other.concat(filtered);
      return remaining;
    };

    // If dropped in same column -> reorder locally and persist order
    if (source.droppableId === destination.droppableId) {
      const newApps = reorderWithin(applications, source.droppableId, source.index, destination.index);
      useAppStore.setState({ applications: newApps });
      // persist ordering (optimistic)
      const orderedIds = newApps.map((a) => a._id);
      const ok = await useAppStore.getState().updateApplicationsOrder(orderedIds);
      if (!ok) {
        // rollback handled inside store, but restore previous if needed
        useAppStore.setState({ applications });
      }
      return;
    }

    // Moving across columns: optimistic update then call backend
    const prevApps = applications;
    const moving = applications.find((a) => a._id === draggableId);
    if (!moving) return;

    const updated = { ...moving, status: destination.droppableId };
    const newApplications = applications
      .filter((a) => a._id !== draggableId)
      .concat(updated);

    // Optimistically update store
    useAppStore.setState({ applications: newApplications });

    const ok = await updateApplicationStatus(draggableId, destination.droppableId);
    if (!ok) {
      // rollback on failure
      useAppStore.setState({ applications: prevApps });
    }
  };

  const onUpdateCurrentStatus = async (status, updates = {}) => {
    if (!selectedApplication) return;
    await updateApplicationStatus(selectedApplication._id, status, updates);
  };

  const onSaveAppliedDetails = async () => {
    if (!selectedApplication) return;
    await saveApplicationDetails(selectedApplication._id, candidateDetails);
  };

  const onShortlist = async () => {
    await onUpdateCurrentStatus('shortlisted', {
      reviewSummary: reviewDetails.summary,
      shortlistedReason: reviewDetails.shortlistedReason,
      rejectionReason: '',
    });
  };

  const onReject = async () => {
    await onUpdateCurrentStatus('rejected', {
      reviewSummary: reviewDetails.summary,
      rejectionReason: reviewDetails.rejectionReason,
    });
  };

  const onSendInterviewRequest = async () => {
    if (!selectedApplication) return;
    // Generate secure links via backend so they include a token
    try {
      const formRes = await api.post(`/applications/${selectedApplication._id}/generate-link`, { type: 'form', email: selectedApplication.applicant?.email });
      const examRes = await api.post(`/applications/${selectedApplication._id}/generate-link`, { type: 'exam', email: selectedApplication.applicant?.email });
      const formLink = formRes.data?.url || interviewRequest.formLink;
      const examLink = examRes.data?.url || interviewRequest.examLink;
      setInterviewRequest((prev) => ({ ...prev, formLink, examLink }));
      await requestInterview(selectedApplication._id, {
        formLink,
        examLink,
        interviewer: interviewRequest.interviewer,
        interviewDate: interviewRequest.interviewDate,
        interviewNotes: interviewRequest.interviewNotes,
      });
      const generatedLinkState = { formLink, examLink, applicationId: selectedApplication._id };
      setLastGeneratedLinks(generatedLinkState);
      localStorage.setItem('ats_pipeline_last_generated_links', JSON.stringify(generatedLinkState));
      useAppStore.getState().pushNotification({
        type: 'success',
        title: 'Links generated',
        message: 'Candidate form and interview exam links are ready to share.',
      });
    } catch (err) {
      // fallback to sending provided links
      await requestInterview(selectedApplication._id, {
        formLink: interviewRequest.formLink,
        examLink: interviewRequest.examLink,
        interviewer: interviewRequest.interviewer,
        interviewDate: interviewRequest.interviewDate,
        interviewNotes: interviewRequest.interviewNotes,
      });
    }
  };

  const onSetInterviewOutcome = async (passed) => {
    if (!selectedApplication) return;
    const parsedScore = Number(interviewResult.score);
    await submitInterviewResult(selectedApplication._id, {
      passed,
      score: Number.isFinite(parsedScore) ? parsedScore : undefined,
      feedback: interviewResult.feedback,
    });
  };

  const onUpdateOfferContent = async () => {
    await onUpdateCurrentStatus('offered', {
      offerLetterLink: offerDetails.offerLetterLink,
      offerMessage: offerDetails.offerMessage,
    });
  };

  const stageStatus = selectedApplication?.status || 'applied';
  const workflow = selectedApplication?.workflow || {};

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
                  <KanbanBoard
                    columns={columns}
                    selectedApplicationId={selectedApplicationId}
                    onSelectApplication={setSelectedApplicationId}
                  />
                </DragDropContext>
              </div>
            </div>
            <div className="space-y-6">
              <PipelineStageTabs stages={stageDefinitions} selectedStage={selectedStage} onSelect={setSelectedStage} />
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-5 shadow-2xl shadow-slate-950/20">
                <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Candidate workflow details</p>
                {!selectedApplication ? (
                  <p className="mt-4 text-sm text-slate-400">Select a candidate card from the board to manage details and stage actions.</p>
                ) : (
                  <div className="mt-4 space-y-5">
                    <div className="rounded-2xl bg-slate-900/80 p-4 ring-1 ring-white/10">
                      <p className="text-lg font-semibold text-white">{selectedApplication.applicant?.name}</p>
                      <p className="mt-1 text-sm text-slate-400">{selectedApplication.applicant?.email}</p>
                      <p className="mt-1 text-sm text-slate-400">{selectedApplication.job?.title} at {selectedApplication.job?.company}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.24em] text-cyan-300">Current stage: {stageStatus}</p>
                    </div>

                    {stageStatus === 'applied' && (
                      <div className="space-y-3 rounded-2xl bg-slate-900/75 p-4 ring-1 ring-white/10">
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Applied details form</p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <Field label="Phone"><input className={inputClass} value={candidateDetails.phone} onChange={(e) => setCandidateDetails((prev) => ({ ...prev, phone: e.target.value }))} /></Field>
                          <Field label="Experience (years)"><input className={inputClass} value={candidateDetails.experienceYears} onChange={(e) => setCandidateDetails((prev) => ({ ...prev, experienceYears: e.target.value }))} /></Field>
                          <Field label="Notice period"><input className={inputClass} value={candidateDetails.noticePeriod} onChange={(e) => setCandidateDetails((prev) => ({ ...prev, noticePeriod: e.target.value }))} /></Field>
                          <Field label="Current location"><input className={inputClass} value={candidateDetails.currentLocation} onChange={(e) => setCandidateDetails((prev) => ({ ...prev, currentLocation: e.target.value }))} /></Field>
                          <Field label="Expected CTC"><input className={inputClass} value={candidateDetails.expectedCtc} onChange={(e) => setCandidateDetails((prev) => ({ ...prev, expectedCtc: e.target.value }))} /></Field>
                          <Field label="Portfolio URL"><input className={inputClass} value={candidateDetails.portfolioUrl} onChange={(e) => setCandidateDetails((prev) => ({ ...prev, portfolioUrl: e.target.value }))} /></Field>
                        </div>
                        <Field label="Why applying for this role"><textarea className={textAreaClass} value={candidateDetails.whyThisRole} onChange={(e) => setCandidateDetails((prev) => ({ ...prev, whyThisRole: e.target.value }))} /></Field>
                        <div className="flex flex-wrap gap-2">
                          <button type="button" onClick={onSaveAppliedDetails} className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">Save details</button>
                          <button type="button" onClick={() => onUpdateCurrentStatus('reviewing')} className="rounded-xl bg-indigo-500/90 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400">Move to Reviewing</button>
                        </div>
                      </div>
                    )}

                    {stageStatus === 'reviewing' && (
                      <div className="space-y-3 rounded-2xl bg-slate-900/75 p-4 ring-1 ring-white/10">
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Review decision panel</p>
                        <Field label="Review summary"><textarea className={textAreaClass} value={reviewDetails.summary} onChange={(e) => setReviewDetails((prev) => ({ ...prev, summary: e.target.value }))} /></Field>
                        <Field label="Reason to shortlist"><textarea className={textAreaClass} value={reviewDetails.shortlistedReason} onChange={(e) => setReviewDetails((prev) => ({ ...prev, shortlistedReason: e.target.value }))} /></Field>
                        <Field label="Reason to reject"><textarea className={textAreaClass} value={reviewDetails.rejectionReason} onChange={(e) => setReviewDetails((prev) => ({ ...prev, rejectionReason: e.target.value }))} /></Field>
                        <div className="flex flex-wrap gap-2">
                          <button type="button" onClick={onShortlist} className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400">Shortlist</button>
                          <button type="button" onClick={onReject} className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400">Reject</button>
                        </div>
                      </div>
                    )}

                    {stageStatus === 'shortlisted' && (
                      <div className="space-y-3 rounded-2xl bg-slate-900/75 p-4 ring-1 ring-white/10">
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Interview setup</p>
                        <p className="text-sm text-slate-300">Shortlist reason: {workflow.review?.shortlistedReason || 'Add reason in reviewing stage.'}</p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <Field label="Candidate form link"><input className={inputClass} value={interviewRequest.formLink} onChange={(e) => setInterviewRequest((prev) => ({ ...prev, formLink: e.target.value }))} /></Field>
                          <Field label="Interview exam link"><input className={inputClass} value={interviewRequest.examLink} onChange={(e) => setInterviewRequest((prev) => ({ ...prev, examLink: e.target.value }))} /></Field>
                          <Field label="Interviewer"><input className={inputClass} value={interviewRequest.interviewer} onChange={(e) => setInterviewRequest((prev) => ({ ...prev, interviewer: e.target.value }))} /></Field>
                          <Field label="Interview date/time"><input type="datetime-local" className={inputClass} value={interviewRequest.interviewDate} onChange={(e) => setInterviewRequest((prev) => ({ ...prev, interviewDate: e.target.value }))} /></Field>
                        </div>
                        <Field label="Interview instructions"><textarea className={textAreaClass} value={interviewRequest.interviewNotes} onChange={(e) => setInterviewRequest((prev) => ({ ...prev, interviewNotes: e.target.value }))} /></Field>
                        <div className="flex flex-wrap gap-2">
                          <button type="button" onClick={onSendInterviewRequest} className="rounded-xl bg-violet-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-400">Send form and exam link</button>
                        </div>

                        {(interviewRequest.formLink || workflow.interview?.formLink || interviewRequest.examLink || workflow.interview?.examLink) && (
                          <div className="mt-3 rounded-lg bg-slate-950/60 p-3 ring-1 ring-white/5">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Generated links</p>
                            <div className="mt-2 space-y-2">
                              {((interviewRequest.formLink || workflow.interview?.formLink)) && (
                                <div className="flex items-center justify-between gap-2">
                                  <div className="truncate text-sm text-slate-200">Form: {interviewRequest.formLink || workflow.interview?.formLink}</div>
                                  <div className="flex items-center gap-2">
                                    <a href={interviewRequest.formLink || workflow.interview?.formLink} target="_blank" rel="noreferrer" className="text-cyan-300 text-sm">Open</a>
                                    <button type="button" onClick={() => copyToClipboard(interviewRequest.formLink || workflow.interview?.formLink, 'Candidate form')} className="text-sm text-slate-300">Copy</button>
                                  </div>
                                </div>
                              )}
                              {((interviewRequest.examLink || workflow.interview?.examLink)) && (
                                <div className="flex items-center justify-between gap-2">
                                  <div className="truncate text-sm text-slate-200">Exam: {interviewRequest.examLink || workflow.interview?.examLink}</div>
                                  <div className="flex items-center gap-2">
                                    <a href={interviewRequest.examLink || workflow.interview?.examLink} target="_blank" rel="noreferrer" className="text-cyan-300 text-sm">Open</a>
                                    <button type="button" onClick={() => copyToClipboard(interviewRequest.examLink || workflow.interview?.examLink, 'Interview exam')} className="text-sm text-slate-300">Copy</button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {lastGeneratedLinks?.applicationId === selectedApplication._id && (
                          <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3 ring-1 ring-cyan-500/10">
                            <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Last generated for this candidate</p>
                            <div className="mt-2 space-y-2 text-sm text-slate-200">
                              <div className="truncate rounded-xl bg-slate-950/60 px-3 py-2 ring-1 ring-white/5">Form: {lastGeneratedLinks.formLink || 'Not generated yet'}</div>
                              <div className="truncate rounded-xl bg-slate-950/60 px-3 py-2 ring-1 ring-white/5">Exam: {lastGeneratedLinks.examLink || 'Not generated yet'}</div>
                            </div>
                          </div>
                        )}

                        {copiedLinkHistory.length > 0 && (
                          <div className="rounded-lg border border-white/5 bg-slate-950/50 p-3">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Recent copies</p>
                            <div className="mt-2 space-y-2">
                              {copiedLinkHistory.map((item) => (
                                <div key={`${item.label}-${item.copiedAt}`} className="flex items-center justify-between gap-3 rounded-xl bg-slate-900/60 px-3 py-2 text-xs text-slate-300 ring-1 ring-white/5">
                                  <div className="min-w-0">
                                    <p className="font-semibold text-slate-100">{item.label}</p>
                                    <p className="truncate text-slate-400">{item.text}</p>
                                  </div>
                                  <span className="flex-shrink-0 text-slate-500">{item.copiedAt}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {stageStatus === 'interviewed' && (
                      <div className="space-y-3 rounded-2xl bg-slate-900/75 p-4 ring-1 ring-white/10">
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Interview result panel</p>
                        <p className="text-sm text-slate-300">
                          Form link:{' '}
                          {workflow.interview?.formLink ? (
                            <a href={workflow.interview.formLink} target="_blank" rel="noreferrer" className="text-cyan-300 underline underline-offset-2 hover:text-cyan-200">
                              Open candidate form
                            </a>
                          ) : 'Not shared yet'}
                        </p>
                        <p className="text-sm text-slate-300">
                          Exam link:{' '}
                          {workflow.interview?.examLink ? (
                            <a href={workflow.interview.examLink} target="_blank" rel="noreferrer" className="text-cyan-300 underline underline-offset-2 hover:text-cyan-200">
                              Open interview exam
                            </a>
                          ) : 'Not shared yet'}
                        </p>
                        <Field label="Interview score"><input className={inputClass} value={interviewResult.score} onChange={(e) => setInterviewResult((prev) => ({ ...prev, score: e.target.value }))} /></Field>
                        <Field label="Interview feedback"><textarea className={textAreaClass} value={interviewResult.feedback} onChange={(e) => setInterviewResult((prev) => ({ ...prev, feedback: e.target.value }))} /></Field>
                        <div className="flex flex-wrap gap-2">
                          <button type="button" onClick={() => onSetInterviewOutcome(true)} className="rounded-xl bg-lime-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-lime-400">Mark passed and send offer</button>
                          <button type="button" onClick={() => onSetInterviewOutcome(false)} className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400">Mark failed and reject</button>
                        </div>
                      </div>
                    )}

                    {stageStatus === 'offered' && (
                      <div className="space-y-3 rounded-2xl bg-slate-900/75 p-4 ring-1 ring-white/10">
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Offer communication</p>
                        <p className="text-sm text-slate-300">Offer email sent to: {workflow.communication?.lastEmailTo || selectedApplication.applicant?.email}</p>
                        <Field label="Offer letter link"><input className={inputClass} value={offerDetails.offerLetterLink} onChange={(e) => setOfferDetails((prev) => ({ ...prev, offerLetterLink: e.target.value }))} /></Field>
                        <Field label="Offer message"><textarea className={textAreaClass} value={offerDetails.offerMessage} onChange={(e) => setOfferDetails((prev) => ({ ...prev, offerMessage: e.target.value }))} /></Field>
                        <button type="button" onClick={onUpdateOfferContent} className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">Update offer letter details</button>
                      </div>
                    )}

                    {stageStatus === 'rejected' && (
                      <div className="space-y-3 rounded-2xl bg-slate-900/75 p-4 ring-1 ring-white/10">
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Rejection summary</p>
                        <p className="text-sm text-slate-300">Reason not shortlisted/interview-cleared:</p>
                        <p className="rounded-xl bg-slate-950/70 p-3 text-sm text-slate-200 ring-1 ring-white/5">
                          {workflow.review?.rejectionReason || 'No rejection reason recorded yet.'}
                        </p>
                        <p className="text-sm text-slate-400">Candidate has been marked rejected in the platform and communication status is updated.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PipelinePage;