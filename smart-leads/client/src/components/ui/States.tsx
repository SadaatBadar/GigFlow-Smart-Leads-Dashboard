import React from 'react';
import { Users, Search } from 'lucide-react';

export const Spinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };
  return (
    <div
      className={`${sizes[size]} animate-spin rounded-full border-2 border-brand-200 border-t-brand-600`}
      role="status"
      aria-label="Loading"
    />
  );
};

export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-64">
    <div className="flex flex-col items-center gap-3">
      <Spinner size="lg" />
      <p className="text-sm text-slate-500 dark:text-slate-400">Loading...</p>
    </div>
  </div>
);

export const EmptyState = ({
  title = 'No leads found',
  description = 'Try adjusting your filters or create a new lead.',
  icon: Icon = Users,
  action,
}: {
  title?: string;
  description?: string;
  icon?: React.ElementType;
  action?: React.ReactNode;
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
      <Icon className="w-7 h-7 text-slate-400 dark:text-slate-400" />
    </div>
    <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">{title}</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">{description}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export const ErrorState = ({ message, onRetry }: { message?: string; onRetry?: () => void }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-14 h-14 bg-red-50 dark:bg-red-950 rounded-2xl flex items-center justify-center mb-3">
      <Search className="w-6 h-6 text-red-400" />
    </div>
    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{message || 'Something went wrong'}</p>
    {onRetry && (
      <button onClick={onRetry} className="btn-secondary text-sm">
        Try again
      </button>
    )}
  </div>
);
