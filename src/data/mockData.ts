import type { Complaint, User, Department } from '@/types';

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@campus.edu',
    role: 'student',
    studentId: 'CS21B001',
  },
  {
    id: 'u2',
    name: 'Dr. Meera Nair',
    email: 'meera.nair@campus.edu',
    role: 'staff',
    department: 'IT Services',
  },
  {
    id: 'u3',
    name: 'Prof. Rajesh Kumar',
    email: 'rajesh.kumar@campus.edu',
    role: 'admin',
    department: 'Administration',
  },
];

export const mockComplaints: Complaint[] = [
  {
    id: 'C-1001',
    title: 'Wi-Fi not working in Block C',
    description:
      'The Wi-Fi in Block C, second floor has been down for the past two days. Students cannot access online resources during lectures.',
    category: 'Wi-Fi',
    status: 'In Progress',
    priority: 'High',
    studentName: 'Aarav Sharma',
    studentId: 'CS21B001',
    department: 'IT Services',
    createdAt: '2026-09-10T09:30:00Z',
    updatedAt: '2026-09-12T14:00:00Z',
  },
  {
    id: 'C-1002',
    title: 'Bus 7 always late',
    description:
      'Campus bus route 7 has been arriving 20-30 minutes late consistently for the past week, causing students to miss morning classes.',
    category: 'Transport',
    status: 'Pending',
    priority: 'Medium',
    studentName: 'Priya Verma',
    studentId: 'EE22B045',
    department: 'Transport Cell',
    createdAt: '2026-09-13T08:15:00Z',
    updatedAt: '2026-09-13T08:15:00Z',
  },
  {
    id: 'C-1003',
    title: 'Broken projector in Lab 204',
    description:
      'The projector in Lab 204 is flickering and unusable. This is affecting lab sessions for the ECE department.',
    category: 'Maintenance',
    status: 'Resolved',
    priority: 'Medium',
    studentName: 'Rohan Gupta',
    studentId: 'EC20B012',
    department: 'Maintenance',
    createdAt: '2026-09-01T11:00:00Z',
    updatedAt: '2026-09-05T16:30:00Z',
  },
  {
    id: 'C-1004',
    title: 'Fee receipt not generated',
    description:
      'I paid my semester fees online but the receipt has not been generated. I need it for my scholarship reimbursement.',
    category: 'Fees',
    status: 'Pending',
    priority: 'High',
    studentName: 'Sneha Reddy',
    studentId: 'ME23B078',
    department: 'Accounts',
    createdAt: '2026-09-14T13:45:00Z',
    updatedAt: '2026-09-14T13:45:00Z',
  },
  {
    id: 'C-1005',
    title: 'Syllabus mismatch in DS course',
    description:
      'The Data Structures syllabus on the portal does not match what is being taught in class. Please update it.',
    category: 'Academics',
    status: 'In Progress',
    priority: 'Low',
    studentName: 'Karthik Iyer',
    studentId: 'CS22B033',
    department: 'Academic Office',
    createdAt: '2026-09-08T10:20:00Z',
    updatedAt: '2026-09-11T09:00:00Z',
  },
  {
    id: 'C-1006',
    title: 'AC not cooling in Library',
    description:
      'The air conditioning on the first floor of the central library is not working. It becomes very hot in the afternoon.',
    category: 'Maintenance',
    status: 'Pending',
    priority: 'Medium',
    studentName: 'Aarav Sharma',
    studentId: 'CS21B001',
    department: 'Maintenance',
    createdAt: '2026-09-15T15:00:00Z',
    updatedAt: '2026-09-15T15:00:00Z',
  },
  {
    id: 'C-1007',
    title: 'Slow internet in hostel',
    description:
      'Internet speed in the boys hostel is extremely slow, making it impossible to attend online classes or submit assignments.',
    category: 'Wi-Fi',
    status: 'Resolved',
    priority: 'High',
    studentName: 'Vikram Singh',
    studentId: 'IT21B056',
    department: 'IT Services',
    createdAt: '2026-08-25T18:30:00Z',
    updatedAt: '2026-08-30T10:00:00Z',
  },
  {
    id: 'C-1008',
    title: 'Wrong exam date on portal',
    description:
      'The midterm exam date for Mathematics shows October 5 on the portal but the circular says October 7. Please correct it.',
    category: 'Academics',
    status: 'Rejected',
    priority: 'Low',
    studentName: 'Ananya Das',
    studentId: 'MA22B009',
    department: 'Academic Office',
    createdAt: '2026-09-06T07:45:00Z',
    updatedAt: '2026-09-07T11:20:00Z',
  },
];

export const mockDepartments: Department[] = [
  { id: 'd1', name: 'IT Services', assignedCount: 12, resolvedCount: 8 },
  { id: 'd2', name: 'Transport Cell', assignedCount: 7, resolvedCount: 3 },
  { id: 'd3', name: 'Maintenance', assignedCount: 15, resolvedCount: 10 },
  { id: 'd4', name: 'Accounts', assignedCount: 5, resolvedCount: 2 },
  { id: 'd5', name: 'Academic Office', assignedCount: 9, resolvedCount: 6 },
];
