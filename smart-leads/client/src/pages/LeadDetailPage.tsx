import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, Mail, Calendar, User } from 'lucide-react';
import { useLead, useUpdateLead, useDeleteLead } from '../hooks/useLeads';
import { useAuth } from '../context/AuthContext';
import { LeadFormData } from '../types';
import { StatusBadge, SourceBadge } from '../components/ui/Badge';
import LeadForm from '../components/leads/LeadForm';
import Modal from '../components/ui/Modal';
import { PageLoader, ErrorState } from '../components/ui/States';

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const { data: lead, isLoading, isError, refetch } = useLead(id || '');
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();

  const handleUpdate = async (data: LeadFormData) => {
    if (!id) return;
    await updateLead.mutateAsync({ id, data });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!id || !confirm('Delete this lead permanently?')) return;
    await deleteLead.mutateAsync(id);
    navigate('/leads');
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  if (isLoading) return <PageLoader />;
  if (isError || !lead) return <ErrorState message="Lead not found" onRetry={() => refetch()} />;

  const createdByName = typeof lead.createdBy === 'string'
    ? lead.createdBy
    : lead.createdBy?.name;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-5 animate-fade-in">
      {/* Back */}
      <button
        onClick={() => navigate('/leads')}
        className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to leads
      </button>

      {/* Header card */}
      <div className="card p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-100 dark:bg-brand-950 flex items-center justify-center text-brand-700 dark:text-brand-300 font-display font-bold text-xl">
              {lead.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white">{lead.name}</h1>
              <a
                href={`mailto:${lead.email}`}
                className="flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 mt-0.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                {lead.email}
              </a>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsEditing(true)} className="btn-secondary">
              <Pencil className="w-4 h-4" />
              Edit
            </button>
            {isAdmin && (
              <button onClick={handleDelete} className="btn-danger">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Status + Source */}
        <div className="flex items-center gap-2 mt-4">
          <StatusBadge status={lead.status} />
          <SourceBadge source={lead.source} />
        </div>
      </div>

      {/* Details */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="card p-5">
          <h2 className="font-display font-semibold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Timeline
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
                <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Created</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{formatDate(lead.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
                <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Last Updated</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{formatDate(lead.updatedAt)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
                <User className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Created by</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{createdByName || '—'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400 font-semibold mb-3">Notes</h2>
          {lead.notes ? (
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{lead.notes}</p>
          ) : (
            <p className="text-sm text-slate-400 dark:text-slate-500 italic">No notes added</p>
          )}
        </div>
      </div>

      {/* Edit modal */}
      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Lead">
        <LeadForm
          onSubmit={handleUpdate}
          isLoading={updateLead.isPending}
          defaultValues={lead}
          onCancel={() => setIsEditing(false)}
        />
      </Modal>
    </div>
  );
}
