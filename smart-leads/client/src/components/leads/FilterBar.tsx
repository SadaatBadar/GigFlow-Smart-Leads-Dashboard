
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { LeadFilters, LeadStatus, LeadSource, SortOrder } from '../../types';

interface FilterBarProps {
  filters: LeadFilters;
  onFiltersChange: (filters: Partial<LeadFilters>) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export default function FilterBar({
  filters,
  onFiltersChange,
  searchValue,
  onSearchChange,
}: FilterBarProps) {
  const hasActiveFilters =
    filters.status || filters.source || filters.search || filters.sort !== 'latest';

  const clearFilters = () => {
    onFiltersChange({ status: '', source: '', sort: 'latest', page: 1 });
    onSearchChange('');
  };

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-400" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or email..."
          className="input pl-10 pr-4"
        />
        {searchValue && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-2">
        <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />

        {/* Status filter */}
        <div className="relative">
          <select
            value={filters.status || ''}
            onChange={(e) =>
              onFiltersChange({ status: e.target.value as LeadStatus | '', page: 1 })
            }
            className="appearance-none pl-3 pr-7 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>
          <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Source filter */}
        <div className="relative">
          <select
            value={filters.source || ''}
            onChange={(e) =>
              onFiltersChange({ source: e.target.value as LeadSource | '', page: 1 })
            }
            className="appearance-none pl-3 pr-7 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
          >
            <option value="">All Sources</option>
            <option value="Website">Website</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
          </select>
          <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={filters.sort || 'latest'}
            onChange={(e) =>
              onFiltersChange({ sort: e.target.value as SortOrder, page: 1 })
            }
            className="appearance-none pl-3 pr-7 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
          </select>
          <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Clear */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
