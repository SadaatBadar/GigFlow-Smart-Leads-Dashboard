 
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lead, LeadFormData } from '../../types';
import { Spinner } from '../ui/States';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']),
  source: z.enum(['Website', 'Instagram', 'Referral']),
  notes: z.string().max(500, 'Notes max 500 characters').optional(),
});

interface LeadFormProps {
  onSubmit: (data: LeadFormData) => void;
  isLoading: boolean;
  defaultValues?: Partial<Lead>;
  onCancel: () => void;
}

export default function LeadForm({ onSubmit, isLoading, defaultValues, onCancel }: LeadFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name || '',
      email: defaultValues?.email || '',
      status: defaultValues?.status || 'New',
      source: defaultValues?.source || 'Website',
      notes: defaultValues?.notes || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Full Name</label>
          <input {...register('name')} className="input" placeholder="John Doe" />
          {errors.name && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.name.message}</p>}
        </div>

        <div>
          <label className="label">Email Address</label>
          <input {...register('email')} type="email" className="input" placeholder="john@example.com" />
          {errors.email && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Status</label>
          <div className="relative">
            <select {...register('status')} className="select pr-8">
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg className="w-4 h-4 text-slate-400 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="label">Source</label>
          <div className="relative">
            <select {...register('source')} className="select pr-8">
              <option value="Website">Website</option>
              <option value="Instagram">Instagram</option>
              <option value="Referral">Referral</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg className="w-4 h-4 text-slate-400 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="label">Notes <span className="text-slate-400 dark:text-slate-500 font-normal">(optional)</span></label>
        <textarea
          {...register('notes')}
          className="input resize-none"
          rows={3}
          placeholder="Add any relevant notes..."
        />
        {errors.notes && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.notes.message}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? <Spinner size="sm" /> : null}
          {defaultValues ? 'Update Lead' : 'Create Lead'}
        </button>
      </div>
    </form>
  );
}
