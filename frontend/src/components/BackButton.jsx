import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ to = '/dashboard' }) => {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:scale-[1.01] hover:border-indigo-500/40"
    >
      <ArrowLeft size={16} />
      Back
    </button>
  );
};

export default BackButton;
