import { Search, Filter, X } from 'lucide-react';
import { useState } from 'react';

const SearchFilter = ({ onSearch, onFilterChange, onStatusFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const statusOptions = [
    { id: 'applied', label: 'Applied', color: 'cyan' },
    { id: 'reviewing', label: 'Reviewing', color: 'sky' },
    { id: 'shortlisted', label: 'Shortlisted', color: 'emerald' },
    { id: 'interviewed', label: 'Interviewed', color: 'violet' },
    { id: 'offered', label: 'Offered', color: 'lime' },
    { id: 'rejected', label: 'Rejected', color: 'rose' },
  ];

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleStatusToggle = (statusId) => {
    const updated = selectedStatuses.includes(statusId)
      ? selectedStatuses.filter((id) => id !== statusId)
      : [...selectedStatuses, statusId];
    setSelectedStatuses(updated);
    onStatusFilter(updated);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedStatuses([]);
    onSearch('');
    onStatusFilter([]);
  };

  return (
    <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/95 p-4 backdrop-blur-lg">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search candidates by name or email..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-full border border-slate-700 bg-slate-950/50 py-2 pl-10 pr-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="group relative rounded-full border border-slate-700 bg-slate-950/50 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:border-cyan-500/30"
          >
            <Filter className="inline h-4 w-4 mr-2" />
            Filters
            {selectedStatuses.length > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-cyan-500 text-xs font-semibold text-slate-950 flex items-center justify-center animate-bounce">
                {selectedStatuses.length}
              </span>
            )}
          </button>

          {(searchTerm || selectedStatuses.length > 0) && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="rounded-full border border-slate-700 bg-slate-950/50 px-4 py-2 text-sm text-slate-400 transition hover:bg-slate-900 hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="mt-4 border-t border-slate-800 pt-4 animate-slide-in">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Filter by status</p>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((status) => {
              const isSelected = selectedStatuses.includes(status.id);
              const colorMap = {
                cyan: 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300',
                sky: 'bg-sky-500/20 border-sky-500/50 text-sky-300',
                emerald: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300',
                violet: 'bg-violet-500/20 border-violet-500/50 text-violet-300',
                lime: 'bg-lime-500/20 border-lime-500/50 text-lime-300',
                rose: 'bg-rose-500/20 border-rose-500/50 text-rose-300',
              };

              return (
                <button
                  key={status.id}
                  type="button"
                  onClick={() => handleStatusToggle(status.id)}
                  className={`group relative rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition ${
                    isSelected
                      ? `${colorMap[status.color]} ring-2 ring-${status.color}-400`
                      : 'border-slate-700 bg-slate-950/50 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {isSelected && <span className="absolute inset-0 rounded-full bg-current opacity-5 animate-pulse" />}
                  {status.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
