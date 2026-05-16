 
import { useNavigate } from 'react-router-dom';
import { Users, TrendingUp, Target, AlertCircle, Plus, ArrowRight } from 'lucide-react';
import { useStats } from '../hooks/useLeads';
import { useAuth } from '../context/AuthContext';
import { PageLoader, ErrorState } from '../components/ui/States';
import { LeadStatus } from '../types';

const statusColors: Record<LeadStatus, string> = {
  New: 'bg-blue-500',
  Contacted: 'bg-yellow-500',
  Qualified: 'bg-green-500',
  Lost: 'bg-red-500',
};

const sourceColors = ['bg-purple-500', 'bg-pink-500', 'bg-orange-500'];

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: stats, isLoading, isError, refetch } = useStats();

  if (isLoading) return <PageLoader />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const totalLeads = stats?.total || 0;
  const qualifiedCount = stats?.statusStats.find((s) => s._id === 'Qualified')?.count || 0;
  const lostCount = stats?.statusStats.find((s) => s._id === 'Lost')?.count || 0;
  const qualifyRate = totalLeads > 0 ? Math.round((qualifiedCount / totalLeads) * 100) : 0;

  const statCards = [
    {
      label: 'Total Leads',
      value: totalLeads,
      icon: Users,
      color: 'bg-brand-600',
      change: 'All time',
    },
    {
      label: 'Qualified',
      value: qualifiedCount,
      icon: Target,
      color: 'bg-green-600',
      change: `${qualifyRate}% rate`,
    },
    {
      label: 'Qualify Rate',
      value: `${qualifyRate}%`,
      icon: TrendingUp,
      color: 'bg-purple-600',
      change: 'Of total leads',
    },
    {
      label: 'Lost',
      value: lostCount,
      icon: AlertCircle,
      color: 'bg-red-500',
      change: 'Needs review',
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Welcome, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Here's what's happening with your leads
          </p>
        </div>
        <button onClick={() => navigate('/leads')} className="btn-primary hidden sm:flex">
          <Plus className="w-4 h-4" />
          New Lead
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, change }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center shadow-sm`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-display font-bold text-slate-900 dark:text-white">{value}</p>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5">{label}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{change}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Status breakdown */}
        <div className="card p-5">
          <h2 className="font-display font-semibold text-slate-900 dark:text-white mb-4">Leads by Status</h2>
          <div className="space-y-3">
            {(['New', 'Contacted', 'Qualified', 'Lost'] as LeadStatus[]).map((status) => {
              const count = stats?.statusStats.find((s) => s._id === status)?.count || 0;
              const pct = totalLeads > 0 ? (count / totalLeads) * 100 : 0;
              return (
                <div key={status}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">{status}</span>
                    <span className="text-slate-900 dark:text-white font-semibold tabular-nums">{count}</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${statusColors[status]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Source breakdown */}
        <div className="card p-5">
          <h2 className="font-display font-semibold text-slate-900 dark:text-white mb-4">Leads by Source</h2>
          <div className="space-y-3">
            {(['Website', 'Instagram', 'Referral'] as const).map((source, i) => {
              const count = stats?.sourceStats.find((s) => s._id === source)?.count || 0;
              const pct = totalLeads > 0 ? (count / totalLeads) * 100 : 0;
              return (
                <div key={source}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">{source}</span>
                    <span className="text-slate-900 dark:text-white font-semibold tabular-nums">{count}</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${sourceColors[i]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="card p-5">
        <h2 className="font-display font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/leads')}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-50 text-brand-700 rounded-xl text-sm font-medium hover:bg-brand-100 dark:bg-brand-950 dark:text-brand-300 dark:hover:bg-brand-900 transition-colors"
          >
            <Users className="w-4 h-4" />
            View All Leads
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => navigate('/leads?create=true')}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-50 text-green-700 rounded-xl text-sm font-medium hover:bg-green-100 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Lead
          </button>
        </div>
      </div>
    </div>
  );
}
