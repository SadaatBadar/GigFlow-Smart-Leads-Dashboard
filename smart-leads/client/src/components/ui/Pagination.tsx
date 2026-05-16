 
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationMeta } from '../../types';
import clsx from 'clsx';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export default function Pagination({ meta, onPageChange }: PaginationProps) {
  const { page, totalPages, total, limit, hasNext, hasPrev } = meta;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    if (page <= 3) return i + 1;
    if (page >= totalPages - 2) return totalPages - 4 + i;
    return page - 2 + i;
  });

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Showing <span className="font-medium text-slate-700 dark:text-slate-200">{start}–{end}</span> of{' '}
        <span className="font-medium text-slate-700 dark:text-slate-200">{total}</span> leads
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrev}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={clsx(
              'w-8 h-8 rounded-lg text-sm font-medium transition-colors',
              p === page
                ? 'bg-brand-600 text-white'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
            )}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
