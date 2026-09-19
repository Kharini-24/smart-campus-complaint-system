import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ComplaintCard from '@/components/ComplaintCard';
import { useAuth } from '@/lib/auth';
import { api, type BackendComplaint } from '@/lib/api';
import { backendToFrontend } from '@/lib/complaintUtils';
import type { ComplaintStatus } from '@/types';

const statusFilters: (ComplaintStatus | 'All')[] = [
  'All',
  'Pending',
  'In Progress',
  'Resolved',
  'Rejected',
];

export default function MyComplaintsPage() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<BackendComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<ComplaintStatus | 'All'>('All');

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.myComplaints();
      setComplaints(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const frontendComplaints = complaints.map(backendToFrontend);

  const filtered = frontendComplaints.filter((c) => {
    const matchesSearch =
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      (c.location || '').toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || c.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout role="student" userName={user?.name || 'Student'}>
      <div className="p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">My Complaints</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track the status of all your submitted complaints.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-rose-50 border border-rose-200 px-4 py-2.5 text-sm text-rose-700">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search complaints..."
              className="w-full rounded-lg border border-slate-300 pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="h-4.5 w-4.5 text-slate-400 shrink-0" />
            {statusFilters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-teal-600 text-white'
                    : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="mb-4 text-sm text-slate-500">
          Showing {filtered.length} of {frontendComplaints.length} complaints
        </p>

        {/* Complaint list */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-teal-500" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((complaint) => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <p className="text-sm text-slate-500">
              {frontendComplaints.length === 0
                ? "You haven't submitted any complaints yet."
                : 'No complaints found matching your filters.'}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
