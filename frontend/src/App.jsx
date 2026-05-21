import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import HomePage from './components/HomePage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import RolesPage from './pages/RolesPage';
import PipelinePage from './pages/PipelinePage';
import WorkflowWorkspacePage from './pages/WorkflowWorkspacePage';
import ErrorBoundary from './components/ErrorBoundary';
import NotificationCenter from './components/NotificationCenter';
import './App.css';

function App() {
  const token = useAppStore((state) => state.token);

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <NotificationCenter />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={token ? <Dashboard /> : <Navigate replace to="/login" />}
          />
          <Route
            path="/roles"
            element={token ? <RolesPage /> : <Navigate replace to="/login" />}
          />
          <Route
            path="/pipeline"
            element={token ? <PipelinePage /> : <Navigate replace to="/login" />}
          />
          <Route
            path="/workflow"
            element={token ? <WorkflowWorkspacePage /> : <Navigate replace to="/login" />}
          />
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;