import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Lead, LeadFilters, LeadFormData, ApiResponse, StatsData } from '../types';
import toast from 'react-hot-toast';

export const useLeads = (filters: LeadFilters) => {
  return useQuery({
    queryKey: ['leads', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.source) params.append('source', filters.source);
      if (filters.search) params.append('search', filters.search);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.page) params.append('page', String(filters.page));

      const res = await api.get<ApiResponse<Lead[]>>(`/leads?${params}`);
      return res.data;
    },
    staleTime: 30_000,
  });
};

export const useLead = (id: string) => {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Lead>>(`/leads/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
};

export const useStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<StatsData>>('/leads/stats');
      return res.data.data;
    },
    staleTime: 60_000,
  });
};

export const useCreateLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: LeadFormData) => api.post('/leads', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Lead created successfully');
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || 'Failed to create lead');
    },
  });
};

export const useUpdateLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LeadFormData> }) =>
      api.put(`/leads/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Lead updated successfully');
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || 'Failed to update lead');
    },
  });
};

export const useDeleteLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/leads/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Lead deleted');
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || 'Failed to delete lead');
    },
  });
};

export const useExportLeads = () => {
  return useMutation({
    mutationFn: async () => {
      const res = await api.get('/leads/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leads-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => toast.success('CSV exported successfully'),
    onError: () => toast.error('Failed to export CSV'),
  });
};
