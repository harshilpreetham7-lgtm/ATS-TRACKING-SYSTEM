import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
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
          <Route path="/" element={<Navigate replace to={token ? '/dashboard' : '/login'} />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;