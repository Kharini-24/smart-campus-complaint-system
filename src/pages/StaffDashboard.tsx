import { useEffect, useMemo, useState } from 'react';
import {
  Inbox,
  Clock,
  Loader2,
  CheckCircle2,
  Search,
  Brain,
  Building2,
} from 'lucide-react';

import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import {
  StatusBadge,
  PriorityBadge,
  CategoryBadge,
} from '@/components/Badges';

import { api, type BackendComplaint } from '@/lib/api';
import { useAuth } from '@/lib/auth';

const statusOptions = [
  'Pending',
  'In Progress',
  'Resolved',
];

export default function StaffDashboard() {
  const { user } = useAuth();

  const [complaints, setComplaints] = useState<BackendComplaint[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load complaints assigned to this staff member's department
  const loadComplaints = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await api.staffComplaints();
      setComplaints(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load complaints',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const total = complaints.length;

  const pending = complaints.filter(
    (c) => c.status === 'Pending',
  ).length;

  const inProgress = complaints.filter(
    (c) => c.status === 'In Progress',
  ).length;

  const resolved = complaints.filter(
    (c) => c.status === 'Resolved',
  ).length;

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        c.description.toLowerCase().includes(searchText) ||
        c.student_name.toLowerCase().includes(searchText) ||
        c.category?.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === 'All' ||
        c.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [complaints, search, statusFilter]);

  const handleStatusChange = async (
    complaint: BackendComplaint,
    newStatus: string,
  ) => {
    try {
      let resolutionNote: string | undefined;

      if (newStatus === 'Resolved') {
        resolutionNote =
          window.prompt(
            'Enter a resolution note:',
            'Complaint resolved successfully.',
          ) || undefined;
      }

      const updated = await api.updateComplaintStatus(
        complaint.id,
        newStatus,
        resolutionNote,
      );

      setComplaints((current) =>
        current.map((c) =>
          c.id === updated.id ? updated : c,
        ),
      );
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : 'Failed to update complaint status',
      );
    }
  };

  return (
    <DashboardLayout
      role="staff"
      userName={user?.name || 'Staff'}
    >
      <div className="p-6 lg:p-8">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="h-5 w-5 text-teal-600" />

            <span className="text-sm font-medium text-teal-600">
              {user?.department || 'Department'}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Staff Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage and resolve complaints assigned to your department.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

          <StatCard
            label="Total Assigned"
            value={total}
            icon={Inbox}
            color="bg-slate-700"
          />

          <StatCard
            label="Pending"
            value={pending}
            icon={Clock}
            color="bg-amber-500"
          />

          <StatCard
            label="In Progress"
            value={inProgress}
            icon={Loader2}
            color="bg-blue-500"
          />

          <StatCard
            label="Resolved"
            value={resolved}
            icon={CheckCircle2}
            color="bg-emerald-500"
          />

        </div>

        {/* ML Banner */}
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-teal-200 bg-teal-50 px-5 py-3">
          <Brain className="h-5 w-5 text-teal-600 shrink-0" />

          <p className="text-sm text-teal-700">
            Complaints are automatically classified by the
            ML model and routed to the appropriate department.
            Update the status as you work on each complaint.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {/* Search & Filter */}
        <div className="mb-4 flex flex-col sm:flex-row gap-3">

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by complaint or student name..."
              className="w-full rounded-lg border border-slate-300 pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            <option value="All">All Statuses</option>

            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

        </div>

        {/* Loading */}
        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-teal-600" />

            <p className="mt-3 text-sm text-slate-500">
              Loading complaints...
            </p>
          </div>
        ) : filtered.length > 0 ? (

          /* Complaint Table */
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">

                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      ID
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Complaint
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Category
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Student
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Priority
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Status
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filtered.map((complaint) => (

                    <tr
                      key={complaint.id}
                      className="hover:bg-slate-50 transition-colors"
                    >

                      <td className="px-4 py-3 text-xs font-mono text-slate-400">
                        {complaint.id.slice(-8)}
                      </td>

                      <td className="px-4 py-3 text-sm font-medium text-slate-900 max-w-sm">
                        <div className="truncate">
                          {complaint.description}
                        </div>

                        <div className="mt-1 text-xs text-slate-400">
                          {complaint.location}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        {complaint.category ? (
                          <CategoryBadge
                            category={complaint.category as any}
                          />
                        ) : (
                          <span className="text-xs text-slate-400">
                            —
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-600">
                        {complaint.student_name}
                      </td>

                      <td className="px-4 py-3">
                        {/* Backend priority will be added later */}
                        <PriorityBadge priority="Medium" />
                      </td>

                      <td className="px-4 py-3">
                        <StatusBadge
                          status={complaint.status as any}
                        />
                      </td>

                      <td className="px-4 py-3">

                        <select
                          value={complaint.status}
                          onChange={(e) =>
                            handleStatusChange(
                              complaint,
                              e.target.value,
                            )
                          }
                          className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500/20"
                        >

                          {statusOptions.map((status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>
                          ))}

                        </select>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        ) : (

          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">

            <Inbox className="mx-auto h-8 w-8 text-slate-300" />

            <p className="mt-3 text-sm text-slate-500">
              No complaints match your filters.
            </p>

          </div>

        )}

      </div>
    </DashboardLayout>
  );
}