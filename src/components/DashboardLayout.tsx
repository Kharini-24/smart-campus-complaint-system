import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  LayoutDashboard,
  FilePlus,
  ListChecks,
  Users,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import type { UserRole } from '@/types';
import { useAuth } from '@/lib/auth';

interface SidebarLink {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const linksByRole: Record<UserRole, SidebarLink[]> = {
  student: [
    { to: '/student', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/submit', label: 'Submit Complaint', icon: FilePlus },
    { to: '/student/complaints', label: 'My Complaints', icon: ListChecks },
  ],
  staff: [
    { to: '/staff', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/staff/complaints', label: 'Manage Complaints', icon: ListChecks },
  ],
  admin: [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Users', icon: Users },
  ],
};

const roleLabels: Record<UserRole, string> = {
  student: 'Student Portal',
  staff: 'Staff Portal',
  admin: 'Admin Portal',
};

export default function DashboardLayout({
  role,
  userName,
  children,
}: {
  role: UserRole;
  userName: string;
  children: React.ReactNode;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = linksByRole[role];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebar = (
    <div className="flex h-full flex-col bg-slate-900 text-slate-300">
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-slate-800">
        <ShieldCheck className="h-7 w-7 text-teal-400" />
        <div>
          <p className="text-sm font-semibold text-white leading-tight">
            Campus Complaints
          </p>
          <p className="text-xs text-slate-500">{roleLabels[role]}</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? 'bg-teal-500/15 text-teal-300 font-medium'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 px-3 py-4">
        <div className="mb-3 px-3">
          <p className="text-sm font-medium text-white">{userName}</p>
          <p className="text-xs text-slate-500 capitalize">{role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut className="h-4.5 w-4.5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-64 shrink-0">{sidebar}</aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 z-10">
            {sidebar}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between bg-slate-900 px-4 py-3 text-white">
          <button onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <span className="text-sm font-medium">Campus Complaints</span>
          <div className="w-6" />
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
