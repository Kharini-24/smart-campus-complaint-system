
import { Link } from 'react-router-dom';
import { ShieldCheck, ClipboardList, MessageCircleQuestion, ArrowRight, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function StudentServicesPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-7 w-7 text-teal-600" />
          <span className="font-bold text-slate-900">CampusComplaints</span>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-rose-600"
        >
          <LogOut size={17} />
          Logout
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome{user?.name ? `, ${user.name}` : ''}!
          </h1>
          <p className="mt-3 text-slate-500">
            What would you like to do today?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Link
            to="/student"
            className="group bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-lg hover:border-teal-400 transition"
          >
            <div className="h-14 w-14 rounded-xl bg-teal-50 flex items-center justify-center">
              <ClipboardList className="h-7 w-7 text-teal-600" />
            </div>

            <h2 className="text-xl font-bold text-slate-900 mt-6">
              Complaints
            </h2>
            <p className="text-sm text-slate-500 mt-2 leading-6">
              Submit campus complaints, let our AI classify them and track their status.
            </p>

            <div className="mt-6 flex items-center gap-2 text-teal-600 font-semibold text-sm">
              Go to Complaints <ArrowRight size={17} />
            </div>
          </Link>

          <Link
            to="/student/assistant"
            className="group bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-lg hover:border-blue-400 transition"
          >
            <div className="h-14 w-14 rounded-xl bg-blue-50 flex items-center justify-center">
              <MessageCircleQuestion className="h-7 w-7 text-blue-600" />
            </div>

            <h2 className="text-xl font-bold text-slate-900 mt-6">
              Doubts & Questions
            </h2>
            <p className="text-sm text-slate-500 mt-2 leading-6">
              Ask questions about college rules, attendance, academic calendars and more.
            </p>

            <div className="mt-6 flex items-center gap-2 text-blue-600 font-semibold text-sm">
              Ask AI Assistant <ArrowRight size={17} />
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
