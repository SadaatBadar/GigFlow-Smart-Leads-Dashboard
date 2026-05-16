 
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { Lead } from '../../types';
import { StatusBadge, SourceBadge } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';

interface LeadTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

export default function LeadTable({ leads, onEdit, onDelete }: LeadTableProps) {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  const getCreatedByName = (createdBy: Lead['createdBy']) => {
    if (typeof createdBy === 'string') return createdBy;
    return createdBy?.name || '—';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-800">
            {['Name', 'Email', 'Status', 'Source', 'Created', 'By', ''].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
          {leads.map((lead) => (
            <tr
              key={lead._id}
              className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
            >
              <td className="px-4 py-3.5">
                <button
                  onClick={() => navigate(`/leads/${lead._id}`)}
                  className="font-medium text-slate-900 dark:text-white hover:text-brand-600 transition-colors text-left"
                >
                  {lead.name}
                </button>
              </td>
              <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400 font-mono text-xs">{lead.email}</td>
              <td className="px-4 py-3.5">
                <StatusBadge status={lead.status} />
              </td>
              <td className="px-4 py-3.5">
                <SourceBadge source={lead.source} />
              </td>
              <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                {formatDate(lead.createdAt)}
              </td>
              <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 text-xs">
                {getCreatedByName(lead.createdBy)}
              </td>
              <td className="px-4 py-3.5">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => navigate(`/leads/${lead._id}`)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                    title="View"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onEdit(lead)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        if (confirm('Delete this lead?')) onDelete(lead._id);
                      }}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
