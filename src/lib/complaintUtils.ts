import type { BackendComplaint } from '@/lib/api';
import type { Complaint } from '@/types';

export function backendToFrontend(c: BackendComplaint): Complaint {
  return {
    id: c.id,

    title:
      c.description.slice(0, 60) +
      (c.description.length > 60 ? '...' : ''),

    description: c.description,

    location: c.location,

    category: (c.category as Complaint['category']) || 'Maintenance',

    status: c.status as Complaint['status'],

    priority: 'Medium',

    studentName: c.student_name,

    studentId: c.student_id,

    department: c.department || 'Unassigned',

    createdAt: c.created_at,

    updatedAt: c.updated_at,

    // Cloudinary image
    imageUrl: c.image_url,
  };
}