 
import { LeadStatus, LeadSource } from '../../types';
import clsx from 'clsx';

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  New: { label: 'New', className: 'badge-new' },
  Contacted: { label: 'Contacted', className: 'badge-contacted' },
  Qualified: { label: 'Qualified', className: 'badge-qualified' },
  Lost: { label: 'Lost', className: 'badge-lost' },
};

const sourceConfig: Record<LeadSource, { label: string; className: string }> = {
  Website: { label: 'Website', className: 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300' },
  Instagram: { label: 'Instagram', className: 'bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300' },
  Referral: { label: 'Referral', className: 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300' },
};

export const StatusBadge = ({ status }: { status: LeadStatus }) => {
  const config = statusConfig[status];
  return <span className={config.className}>{config.label}</span>;
};

export const SourceBadge = ({ source }: { source: LeadSource }) => {
  const config = sourceConfig[source];
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', config.className)}>
      {config.label}
    </span>
  );
};
