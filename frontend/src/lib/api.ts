const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function getToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Don't set Content-Type for FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  // Handle file downloads
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/pdf') || contentType?.includes('spreadsheetml')) {
    return response as unknown as T;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

// Auth
export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<any>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    signup: (data: any) =>
      request<any>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    me: () => request<any>('/auth/me'),
  },

  company: {
    get: () => request<any>('/company'),
    update: (data: any) =>
      request<any>('/company', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    uploadLogo: (file: File) => {
      const formData = new FormData();
      formData.append('logo', file);
      return request<any>('/company/logo', {
        method: 'POST',
        body: formData,
      });
    },
    uploadSignature: (file: File) => {
      const formData = new FormData();
      formData.append('signature', file);
      return request<any>('/company/signature', {
        method: 'POST',
        body: formData,
      });
    },
  },

  certificates: {
    create: (data: any) =>
      request<any>('/certificate', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    list: (params: Record<string, string | number> = {}) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.append(key, String(value));
        }
      });
      return request<any>(`/certificates?${searchParams.toString()}`);
    },
    getById: (id: string) => request<any>(`/certificate/${id}`),
    delete: (id: string) =>
      request<any>(`/certificate/${id}`, { method: 'DELETE' }),
    download: async (id: string) => {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/certificate/download/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Download failed');
      return response.blob();
    },
    preview: (data: any) =>
      request<any>('/certificate/preview', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    downloadTemplate: async () => {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/certificates/template`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Download failed');
      return response.blob();
    },
    stats: () => request<any>('/certificates/stats'),
    bulkGenerate: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return request<any>('/certificate/bulk', {
        method: 'POST',
        body: formData,
      });
    },
  },

  verify: {
    check: (certificateId: string) =>
      request<any>(`/verify/${certificateId}`),
  },

  activity: {
    list: (params: Record<string, string | number> = {}) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.append(key, String(value));
        }
      });
      return request<any>(`/activity?${searchParams.toString()}`);
    },
  },
};
