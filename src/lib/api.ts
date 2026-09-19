const API_BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem('campus_token');
}

export function setToken(token: string): void {
  localStorage.setItem('campus_token', token);
}

export function clearToken(): void {
  localStorage.removeItem('campus_token');
}

export function getStoredUser(): {
  id: string;
  name: string;
  email: string;
  role: string;
  student_id?: string;
  department?: string;
} | null {
  const raw = localStorage.getItem('campus_user');
  return raw ? JSON.parse(raw) : null;
}

export function setStoredUser(user: unknown): void {
  localStorage.setItem('campus_user', JSON.stringify(user));
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const resp = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!resp.ok) {
    const error = await resp
      .json()
      .catch(() => ({ detail: resp.statusText }));

    throw new Error(
      error.detail || `Request failed: ${resp.status}`,
    );
  }

  return resp.json();
}

export const api = {
  // --------------------------------------------------
  // Auth
  // --------------------------------------------------

  register: (
    data: {
      name: string;
      email: string;
      password: string;
      student_id: string;
    },
  ) =>
    request<{
      access_token: string;
      user: AuthUser;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (
    data: {
      email: string;
      password: string;
    },
  ) =>
    request<{
      access_token: string;
      user: AuthUser;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  me: () =>
    request<AuthUser>('/auth/me'),

  // --------------------------------------------------
  // Student Complaints
  // --------------------------------------------------
  uploadImage: async (file: File) => {
    const token = getToken();
  
    const formData = new FormData();
    formData.append('file', file);
  
    const resp = await fetch(`${API_BASE}/uploads/image`, {
      method: 'POST',
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
      body: formData,
    });
  
    if (!resp.ok) {
      const error = await resp
        .json()
        .catch(() => ({ detail: resp.statusText }));
  
      throw new Error(error.detail || `Upload failed: ${resp.status}`);
    }
  
    return resp.json() as Promise<{
      message: string;
      image_url: string;
    }>;
  },
  createComplaint: (data: {
    description: string;
    location: string;
    image_url?: string;
  }) =>
    request<BackendComplaint>('/complaints', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  myComplaints: () =>
    request<BackendComplaint[]>('/complaints/my'),

  getComplaint: (id: string) =>
    request<BackendComplaint>(`/complaints/${id}`),

  // --------------------------------------------------
  // Staff Complaints
  // --------------------------------------------------

  staffComplaints: () =>
    request<BackendComplaint[]>('/complaints/staff'),

  updateComplaintStatus: (
    id: string,
    newStatus: string,
    resolutionNote?: string,
  ) =>
    request<BackendComplaint>(
      `/complaints/${id}/status?new_status=${encodeURIComponent(
        newStatus,
      )}${
        resolutionNote
          ? `&resolution_note=${encodeURIComponent(
              resolutionNote,
            )}`
          : ''
      }`,
      {
        method: 'PUT',
      },
    ),

  // --------------------------------------------------
  // Health
  // --------------------------------------------------
  adminDashboard: () =>
  request<AdminDashboardData>('/admin/dashboard'),
  createFeedback: (data: {
    complaint_id: string;
    rating: number;
    comment?: string;
  }) =>
    request<{ message: string; feedback_id: string }>('/feedback', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  health: () =>
    request<{
      status: string;
      database: string;
    }>('/health'),
};


// --------------------------------------------------
// Types
// --------------------------------------------------

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  student_id?: string;
  department?: string;
}

export interface BackendComplaint {
  id: string;
  student_id: string;
  student_name: string;
  description: string;
  location: string;
  image_url: string | null;
  category: string | null;
  department: string | null;
  status: string;
  resolution_note: string | null;
  created_at: string;
  updated_at: string;
}
export interface AdminDashboardData {
  stats: {
    total: number;
    pending: number;
    in_progress: number;
    resolved: number;
    resolution_rate: number;
  };
  category_counts: Record<string, number>;
  department_stats: Record<
    string,
    {
      assignedCount: number;
      resolvedCount: number;
    }
  >;
  complaints: {
    id: string;
    title: string;
    category: string | null;
    department: string | null;
    studentName: string;
    status: string;
  }[];
}