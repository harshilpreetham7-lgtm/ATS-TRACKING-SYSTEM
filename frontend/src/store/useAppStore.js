import { create } from 'zustand';
import api, { setAuthToken } from '../services/api';
import { connectSocket, disconnectSocket } from '../socket';

const initialUser = JSON.parse(localStorage.getItem('ats_user') || 'null');
const initialToken = localStorage.getItem('ats_token') || '';

export const useAppStore = create((set, get) => ({
  token: initialToken,
  user: initialUser,
  jobs: [],
  applications: [],
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
  logout: () => {
    setAuthToken('');
    localStorage.removeItem('ats_user');
    set({ token: '', user: null, jobs: [], applications: [], notifications: [] });
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
  updateApplicationStatus: async (applicationId, status) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/applications/${applicationId}/status`, { status });
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
}));
