import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FilePlus, Clock, CheckCircle2, Loader2, TrendingUp } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import ComplaintCard from '@/components/ComplaintCard';
import { useAuth } from '@/lib/auth';
import { api, type BackendComplaint } from '@/lib/api';
import { backendToFrontend } from '@/lib/complaintUtils';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<BackendComplaint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.myComplaints();
      setComplaints(data);
    } catch {
      // silently fail — dashboard still shows
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const myComplaints = complaints.map(backendToFrontend);
  const total = myComplaints.length;
  const pending = myComplaints.filter((c) => c.status === 'Pending').length;
  const inProgress = myComplaints.filter((c) => c.status === 'In Progress').length;
  const resolved = myComplaints.filter((c) => c.status === 'Resolved').length;

  return (
    <DashboardLayout role="student" userName={user?.name || 'Student'}>
      <div className="p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">My Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Welcome back, {user?.name || 'Student'}. Here's an overview of your complaints.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Complaints" value={total} icon={TrendingUp} color="bg-slate-700" />
          <StatCard label="Pending" value={pending} icon={Clock} color="bg-amber-500" />
          <StatCard label="In Progress" value={inProgress} icon={Loader2} color="bg-blue-500" />
          <StatCard label="Resolved" value={resolved} icon={CheckCircle2} color="bg-emerald-500" />
        </div>

        {/* Quick action */}
        <div className="mb-8 rounded-xl border border-teal-200 bg-teal-50 p-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Have a new complaint?
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Submit it now and our system will classify and route it automatically.
              </p>
            </div>
            <Link
              to="/student/submit"
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700"
            >
              <FilePlus className="h-4 w-4" />
              Submit Complaint
            </Link>
          </div>
        </div>

        {/* Recent complaints */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Recent Complaints</h2>
            <Link
              to="/student/complaints"
              className="text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              View all
            </Link>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-teal-500" />
            </div>
          ) : myComplaints.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {myComplaints.slice(0, 4).map((complaint) => (
                <ComplaintCard key={complaint.id} complaint={complaint} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
              <p className="text-sm text-slate-500">
                You haven't submitted any complaints yet. Click "Submit Complaint" to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
