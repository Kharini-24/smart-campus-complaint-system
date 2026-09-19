import type { ComplaintStatus, Priority, ComplaintCategory } from '@/types';

export function StatusBadge({ status }: { status: ComplaintStatus }) {
  const styles: Record<ComplaintStatus, string> = {
    Pending: 'bg-amber-100 text-amber-700 border-amber-300',
    'In Progress': 'bg-blue-100 text-blue-700 border-blue-300',
    Resolved: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    Rejected: 'bg-rose-100 text-rose-700 border-rose-300',
  };
  const dots: Record<ComplaintStatus, string> = {
    Pending: 'bg-amber-500',
    'In Progress': 'bg-blue-500',
    Resolved: 'bg-emerald-500',
    Rejected: 'bg-rose-500',
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dots[status]}`} />
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const styles: Record<Priority, string> = {
    Low: 'bg-slate-100 text-slate-600',
    Medium: 'bg-orange-100 text-orange-700',
    High: 'bg-red-100 text-red-700',
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${styles[priority]}`}
    >
      {priority} Priority
    </span>
  );
}

export function CategoryBadge({ category }: { category: ComplaintCategory }) {
  const styles: Record<ComplaintCategory, string> = {
    'Wi-Fi': 'bg-cyan-50 text-cyan-700 border-cyan-200',
    Transport: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Maintenance: 'bg-amber-50 text-amber-700 border-amber-200',
    Fees: 'bg-teal-50 text-teal-700 border-teal-200',
    Academics: 'bg-violet-50 text-violet-700 border-violet-200',
  };
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium ${styles[category]}`}
    >
      {category}
    </span>
  );
}
