import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Download } from 'lucide-react';
import { useLeads, useCreateLead, useUpdateLead, useDeleteLead, useExportLeads } from '../hooks/useLeads';
import { useDebounce } from '../hooks/useDebounce';
import { useAuth } from '../context/AuthContext';
import { Lead, LeadFilters, LeadFormData } from '../types';
import FilterBar from '../components/leads/FilterBar';
import LeadTable from '../components/leads/LeadTable';
import LeadForm from '../components/leads/LeadForm';
import Modal from '../components/ui/Modal';
import Pagination from '../components/ui/Pagination';
import { PageLoader, EmptyState, ErrorState } from '../components/ui/States';
import { Spinner } from '../components/ui/States';

export default function LeadsPage() {
  const [searchParams] = useSearchParams();
  const { isAdmin } = useAuth();

  const [filters, setFilters] = useState<LeadFilters>({
    status: '',
    source: '',
    sort: 'latest',
    page: 1,
  });
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 400);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  // Open create modal if ?create=true in URL
  useEffect(() => {
    if (searchParams.get('create') === 'true') setIsCreateOpen(true);
  }, [searchParams]);

  // Apply debounced search to filters
  const activeFilters: LeadFilters = { ...filters, search: debouncedSearch };

  const { data, isLoading, isError, refetch } = useLeads(activeFilters);
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();
  const exportLeads = useExportLeads();

  const handleFiltersChange = (partial: Partial<LeadFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const handleCreate = async (formData: LeadFormData) => {
    await createLead.mutateAsync(formData);
    setIsCreateOpen(false);
  };

  const handleUpdate = async (formData: LeadFormData) => {
    if (!editingLead) return;
    await updateLead.mutateAsync({ id: editingLead._id, data: formData });
    setEditingLead(null);
  };

  const handleDelete = (id: string) => {
    deleteLead.mutate(id);
  };

  const leads = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Leads</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            {meta ? `${meta.total} total leads` : 'Manage your pipeline'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => exportLeads.mutate()}
              disabled={exportLeads.isPending}
              className="btn-secondary"
            >
              {exportLeads.isPending ? <Spinner size="sm" /> : <Download className="w-4 h-4" />}
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          )}
          <button onClick={() => setIsCreateOpen(true)} className="btn-primary">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Lead</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <FilterBar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          searchValue={searchInput}
          onSearchChange={(v) => {
            setSearchInput(v);
            setFilters((f) => ({ ...f, page: 1 }));
          }}
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <PageLoader />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : leads.length === 0 ? (
          <EmptyState
            title="No leads found"
            description={
              debouncedSearch || filters.status || filters.source
                ? 'No leads match your current filters.'
                : 'Get started by adding your first lead.'
            }
            action={
              <button onClick={() => setIsCreateOpen(true)} className="btn-primary">
                <Plus className="w-4 h-4" />
                Add Lead
              </button>
            }
          />
        ) : (
          <>
            <LeadTable leads={leads} onEdit={setEditingLead} onDelete={handleDelete} />
            {meta && meta.totalPages > 1 && (
              <Pagination
                meta={meta}
                onPageChange={(page) => handleFiltersChange({ page })}
              />
            )}
          </>
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="New Lead">
        <LeadForm
          onSubmit={handleCreate}
          isLoading={createLead.isPending}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingLead}
        onClose={() => setEditingLead(null)}
        title="Edit Lead"
      >
        {editingLead && (
          <LeadForm
            onSubmit={handleUpdate}
            isLoading={updateLead.isPending}
            defaultValues={editingLead}
            onCancel={() => setEditingLead(null)}
          />
        )}
      </Modal>
    </div>
  );
}
