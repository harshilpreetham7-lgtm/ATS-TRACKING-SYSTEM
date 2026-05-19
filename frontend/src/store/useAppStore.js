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
  loading: false,
  error: null,
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
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
    set({ token: '', user: null, jobs: [], applications: [] });
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
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
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
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));
