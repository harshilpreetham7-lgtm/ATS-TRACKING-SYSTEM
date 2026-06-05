import { create } from 'zustand';
import api, { setAuthToken } from '../services/api';
import { connectSocket, disconnectSocket } from '../socket';

const initialUser = JSON.parse(localStorage.getItem('ats_user') || 'null');
const initialToken = localStorage.getItem('ats_token') || '';
const initialSavedWorkflowModules = JSON.parse(localStorage.getItem('ats_saved_workflow_modules') || '{}');

export const useAppStore = create((set, get) => ({
  token: initialToken,
  user: initialUser,
  jobs: [],
  applications: [],
  savedWorkflowModules: initialSavedWorkflowModules,
  notifications: [],
  loading: false,
  error: null,
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  pushNotification: (notification) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    set((state) => ({
      notifications: [
        {
          id,
          type: 'info',
          title: '',
          message: '',
          ...notification,
        },
        ...state.notifications,
      ].slice(0, 6),
    }));
    return id;
  },
  dismissNotification: (id) => {
    set((state) => ({ notifications: state.notifications.filter((item) => item.id !== id) }));
  },
  setUser: (user) => {
    localStorage.setItem('ats_user', JSON.stringify(user));
    set({ user });
  },
  setToken: (token) => {
    setAuthToken(token);
    set({ token });
  },
  saveWorkflowModuleDetails: (moduleId, payload) => {
    set((state) => {
      const nextValue = {
        ...state.savedWorkflowModules,
        [moduleId]: {
          ...payload,
          savedAt: new Date().toISOString(),
        },
      };
      localStorage.setItem('ats_saved_workflow_modules', JSON.stringify(nextValue));
      return { savedWorkflowModules: nextValue };
    });
    get().pushNotification({
      type: 'success',
      title: 'Module saved',
      message: 'Workflow module details have been saved.',
    });
  },
  clearWorkflowModuleDetails: (moduleId) => {
    set((state) => {
      const nextValue = { ...state.savedWorkflowModules };
      delete nextValue[moduleId];
      localStorage.setItem('ats_saved_workflow_modules', JSON.stringify(nextValue));
      return { savedWorkflowModules: nextValue };
    });
    get().pushNotification({
      type: 'info',
      title: 'Module cleared',
      message: 'Saved workflow module details were removed.',
    });
  },
  logout: () => {
    setAuthToken('');
    localStorage.removeItem('ats_user');
    localStorage.removeItem('ats_saved_workflow_modules');
    set({ token: '', user: null, jobs: [], applications: [], savedWorkflowModules: {}, notifications: [] });
    disconnectSocket();
  },
  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/register', payload);
      const { token, user } = response.data;
      get().setToken(token);
      get().setUser(user);
      connectSocket();
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
      return false;
    } finally {
      set({ loading: false });
    }
  },
  login: async (payload) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/login', payload);
      const { token, user } = response.data;
      get().setToken(token);
      get().setUser(user);
      connectSocket();
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
      return false;
    } finally {
      set({ loading: false });
    }
  },
  loadBoard: async () => {
    set({ loading: true, error: null });
    try {
      const [jobsRes, appsRes] = await Promise.all([
        api.get('/jobs'),
        api.get('/applications/my'),
      ]);
      set({ jobs: jobsRes.data, applications: appsRes.data });
      get().pushNotification({
        type: 'success',
        title: 'Board synced',
        message: `Loaded ${jobsRes.data.length} roles and ${appsRes.data.length} candidates.`,
      });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
      get().pushNotification({
        type: 'error',
        title: 'Board sync failed',
        message: error.response?.data?.message || error.message,
      });
      return false;
    } finally {
      set({ loading: false });
    }
  },
  saveApplicationDetails: async (applicationId, details) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/applications/${applicationId}/details`, { details });
      set((state) => ({
        applications: state.applications.map((app) => (app._id === applicationId ? response.data : app)),
      }));
      get().pushNotification({
        type: 'success',
        title: 'Candidate details saved',
        message: 'Applied-stage details were recorded for this candidate.',
      });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
      get().pushNotification({
        type: 'error',
        title: 'Save failed',
        message: error.response?.data?.message || error.message,
      });
      return false;
    } finally {
      set({ loading: false });
    }
  },
  requestInterview: async (applicationId, payload) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/applications/${applicationId}/interview-request`, payload);
      set((state) => ({
        applications: state.applications.map((app) => (app._id === applicationId ? response.data : app)),
      }));
      get().pushNotification({
        type: 'info',
        title: 'Interview request sent',
        message: 'Interview form and exam link were shared with the candidate email.',
      });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
      get().pushNotification({
        type: 'error',
        title: 'Interview request failed',
        message: error.response?.data?.message || error.message,
      });
      return false;
    } finally {
      set({ loading: false });
    }
  },
  submitInterviewResult: async (applicationId, payload) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/applications/${applicationId}/interview-result`, payload);
      set((state) => ({
        applications: state.applications.map((app) => (app._id === applicationId ? response.data : app)),
      }));
      get().pushNotification({
        type: payload?.passed ? 'success' : 'warning',
        title: payload?.passed ? 'Candidate passed interview' : 'Candidate rejected',
        message: payload?.passed
          ? 'Offer letter flow has been triggered for the candidate email.'
          : 'Candidate status updated to rejected with interview feedback.',
      });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
      get().pushNotification({
        type: 'error',
        title: 'Interview result update failed',
        message: error.response?.data?.message || error.message,
      });
      return false;
    } finally {
      set({ loading: false });
    }
  },
  updateApplicationStatus: async (applicationId, status, workflowUpdates = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/applications/${applicationId}/status`, { status, ...workflowUpdates });
      set((state) => ({
        applications: state.applications.map((app) =>
          app._id === applicationId ? response.data : app
        ),
      }));
      get().pushNotification({
        type: 'info',
        title: 'Application updated',
        message: `Moved application ${applicationId} to ${status}.`,
      });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
      get().pushNotification({
        type: 'error',
        title: 'Status update failed',
        message: error.response?.data?.message || error.message,
      });
      return false;
    } finally {
      set({ loading: false });
    }
  },
  updateApplicationsOrder: async (orderedIds) => {
    set({ loading: true, error: null });
    try {
      // send new ordering to backend - backend should accept an array of IDs in desired order
      const response = await api.put('/applications/order', { order: orderedIds });
      // if backend returns updated applications, replace store, otherwise reorder locally
      if (response.data && Array.isArray(response.data)) {
        set({ applications: response.data });
      } else {
        const current = get().applications;
        const byId = {};
        current.forEach((a) => { byId[a._id] = a; });
        const reordered = orderedIds.map((id) => byId[id]).filter(Boolean);
        set({ applications: reordered.concat(current.filter((a) => !orderedIds.includes(a._id))) });
      }
      get().pushNotification({ type: 'success', title: 'Order saved', message: 'Candidate order persisted.' });
      // optionally reload board to sync full state
      if (typeof get().loadBoard === 'function') {
        try { await get().loadBoard(); } catch (e) { /* ignore */ }
      }
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
      get().pushNotification({ type: 'error', title: 'Order save failed', message: error.response?.data?.message || error.message });
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));
