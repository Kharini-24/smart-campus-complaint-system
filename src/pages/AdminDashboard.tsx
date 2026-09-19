import { useEffect, useMemo, useState } from 'react';
import {
  Inbox,
  CheckCircle2,
  Building2,
  TrendingUp,
  Brain,
  Loader2,
} from 'lucide-react';

import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { StatusBadge, CategoryBadge } from '@/components/Badges';
import { api, AdminDashboardData } from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function AdminDashboard() {
  const { user } = useAuth();

  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError('');

        const result = await api.adminDashboard();
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load admin dashboard',
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const categoryEntries = useMemo(() => {
    if (!data) return [];

    return Object.entries(data.category_counts).sort(
      ([, a], [, b]) => b - a,
    );
  }, [data]);

  const maxCategory = Math.max(
    ...categoryEntries.map(([, count]) => count),
    1,
  );

  const departmentEntries = useMemo(() => {
    if (!data) return [];

    return Object.entries(data.department_stats);
  }, [data]);

  if (loading) {
    return (
      <DashboardLayout
        role="admin"
        userName={user?.name || 'Admin'}
      >
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex items-center gap-2 text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading admin dashboard...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout
        role="admin"
        userName={user?.name || 'Admin'}
      >
        <div className="p-6 lg:p-8">
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-6">
            <h2 className="font-semibold text-rose-700">
              Failed to load dashboard
            </h2>
            <p className="mt-2 text-sm text-rose-600">
              {error}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) return null;

  return (
    <DashboardLayout
      role="admin"
      userName={user?.name || 'Admin'}
    >
      <div className="p-6 lg:p-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Admin Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            System-wide overview of complaints, departments, and performance.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">

          <StatCard
            label="Total Complaints"
            value={data.stats.total}
            icon={Inbox}
            color="bg-slate-700"
          />

          <StatCard
            label="Pending"
            value={data.stats.pending}
            icon={TrendingUp}
            color="bg-amber-500"
          />

          <StatCard
            label="Resolved"
            value={data.stats.resolved}
            icon={CheckCircle2}
            color="bg-emerald-500"
          />

          <StatCard
            label="Resolution Rate"
            value={`${data.stats.resolution_rate}%`}
            icon={Brain}
            color="bg-teal-500"
          />

        </div>

        {/* Category + Department */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Category Distribution */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="mb-4 text-base font-semibold text-slate-900">
              Complaints by Category
            </h2>

            {categoryEntries.length === 0 ? (
              <p className="text-sm text-slate-500">
                No complaints available.
              </p>
            ) : (
              <div className="space-y-3">

                {categoryEntries.map(([category, count]) => (
                  <div key={category}>

                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        {category}
                      </span>

                      <span className="text-sm text-slate-500">
                        {count}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                      <div
                        className="h-full rounded-full bg-teal-500 transition-all"
                        style={{
                          width: `${(count / maxCategory) * 100}%`,
                        }}
                      />

                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>

          {/* Department Performance */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="mb-4 text-base font-semibold text-slate-900">
              Department Performance
            </h2>

            {departmentEntries.length === 0 ? (
              <p className="text-sm text-slate-500">
                No department data available.
              </p>
            ) : (
              <div className="space-y-3">

                {departmentEntries.map(([department, stats]) => {

                  const rate =
                    stats.assignedCount > 0
                      ? Math.round(
                          (stats.resolvedCount /
                            stats.assignedCount) *
                            100,
                        )
                      : 0;

                  return (
                    <div
                      key={department}
                      className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2.5"
                    >

                      <div className="flex items-center gap-2.5">

                        <Building2 className="h-4 w-4 text-slate-400" />

                        <span className="text-sm font-medium text-slate-700">
                          {department}
                        </span>

                      </div>

                      <div className="flex items-center gap-3">

                        <span className="text-xs text-slate-400">
                          {stats.resolvedCount}/
                          {stats.assignedCount} resolved
                        </span>

                        <span
                          className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                            rate >= 70
                              ? 'bg-emerald-100 text-emerald-700'
                              : rate >= 40
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {rate}%
                        </span>

                      </div>

                    </div>
                  );
                })}

              </div>
            )}

          </div>

        </div>

        {/* All Complaints */}
        <div className="mb-4">

          <h2 className="text-lg font-semibold text-slate-900">
            All Complaints
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            System-wide complaint log
          </p>

        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    ID
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Complaint
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Category
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Department
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Student
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {data.complaints.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-sm text-slate-500"
                    >
                      No complaints found.
                    </td>
                  </tr>
                ) : (
                  data.complaints.map((complaint) => (

                    <tr
                      key={complaint.id}
                      className="transition-colors hover:bg-slate-50"
                    >

                      <td className="px-4 py-3 text-xs font-mono text-slate-400">
                        {complaint.id.slice(-6)}
                      </td>

                      <td className="max-w-xs truncate px-4 py-3 text-sm font-medium text-slate-900">
                        {complaint.title}
                      </td>

                      <td className="px-4 py-3">
                        {complaint.category ? (
                          <CategoryBadge
                            category={complaint.category}
                          />
                        ) : (
                          <span className="text-xs text-slate-400">
                            —
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-600">
                        {complaint.department || '—'}
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-600">
                        {complaint.studentName || '—'}
                      </td>

                      <td className="px-4 py-3">
                        <StatusBadge status={complaint.status} />
                      </td>

                    </tr>

                  ))
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}