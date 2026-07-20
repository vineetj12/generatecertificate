export interface Certificate {
  id: string;
  certificateId: string;
  studentName: string;
  collegeName: string | null;
  course: string | null;
  internshipRole: string;
  projectName: string | null;
  startDate: string;
  endDate: string;
  description: string;
  templateType: string;
  pdfPath: string | null;
  pdfUrl: string | null;
  qrCodePath: string | null;
  qrCodeUrl: string | null;
  logoPath: string | null;
  logoUrl: string | null;
  signaturePath: string | null;
  signatureUrl: string | null;
  issueDate: string;
  status: string;

  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  address: string;
  website: string | null;
  email: string | null;
  logoPath: string | null;
  logoUrl: string | null;
  signaturePath: string | null;
  signatureUrl: string | null;
  directorName: string | null;
  certificatePrefix: string;
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Statistics {
  total: number;
  todayCount: number;
  monthCount: number;
  validCount: number;
  revokedCount: number;
  recentCertificates: Certificate[];
  monthlyTrend: Array<{ month: string; count: number }>;
  roleDistribution: Array<{ role: string; count: number }>;
}



export interface VerificationResult {
  valid: boolean;
  status: string;
  message?: string;
  certificate?: {
    dbId: string;
    certificateId: string;
    studentName: string;
    collegeName: string | null;
    course: string | null;
    internshipRole: string;
    projectName: string | null;
    startDate: string;
    endDate: string;
    issueDate: string;
    companyName: string;
    companyWebsite: string;
  };
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string | null;
  adminId: string | null;
  createdAt: string;
}
