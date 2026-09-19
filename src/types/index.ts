export type ComplaintCategory =
  | 'Wi-Fi'
  | 'Transport'
  | 'Maintenance'
  | 'Fees'
  | 'Academics';

export type ComplaintStatus =
  | 'Pending'
  | 'In Progress'
  | 'Resolved'
  | 'Rejected';

export type Priority = 'Low' | 'Medium' | 'High';

export type UserRole = 'student' | 'staff' | 'admin';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  location?: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  priority: Priority;
  studentName: string;
  studentId: string;
  department: string;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  studentId?: string;
}

export interface Department {
  id: string;
  name: string;
  assignedCount: number;
  resolvedCount: number;
}
