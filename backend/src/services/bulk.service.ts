import * as XLSX from 'xlsx';
import { createCertificate, CreateCertificateInput } from './certificate.service';
import prisma from '../lib/prisma';

export interface BulkRow {
  studentName: string;
  collegeName?: string;
  course?: string;
  internshipRole: string;
  projectName?: string;
  startDate: string;
  endDate: string;
  description: string;
  templateType?: string;

}

export interface BulkResult {
  total: number;
  successful: number;
  failed: number;
  results: Array<{
    row: number;
    studentName: string;
    status: 'success' | 'error';
    certificateId?: string;
    error?: string;
  }>;
}

const REQUIRED_COLUMNS = ['studentName', 'internshipRole', 'startDate', 'endDate', 'description'];

const COLUMN_MAP: Record<string, string> = {
  'student name': 'studentName',
  'student_name': 'studentName',
  'studentname': 'studentName',
  'name': 'studentName',
  'college name': 'collegeName',
  'college_name': 'collegeName',
  'collegename': 'collegeName',
  'college': 'collegeName',
  'internship role': 'internshipRole',
  'internship_role': 'internshipRole',
  'internshiprole': 'internshipRole',
  'role': 'internshipRole',
  'project name': 'projectName',
  'project_name': 'projectName',
  'projectname': 'projectName',
  'project': 'projectName',
  'start date': 'startDate',
  'start_date': 'startDate',
  'startdate': 'startDate',
  'end date': 'endDate',
  'end_date': 'endDate',
  'enddate': 'endDate',
  'description': 'description',
  'template type': 'templateType',
  'template_type': 'templateType',
  'templatetype': 'templateType',
  'template': 'templateType',

  'course': 'course',
  'degree': 'course',
  'course_name': 'course',
};

function normalizeColumnName(name: string): string {
  const lower = name.toLowerCase().trim();
  return COLUMN_MAP[lower] || lower;
}

export function parseExcel(buffer: Buffer): BulkRow[] {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rawData = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);

  if (rawData.length === 0) {
    throw new Error('Excel file is empty');
  }

  // Normalize column names
  const data = rawData.map((row) => {
    const normalized: Record<string, any> = {};
    for (const [key, value] of Object.entries(row)) {
      const normalizedKey = normalizeColumnName(key);
      normalized[normalizedKey] = value;
    }
    return normalized as BulkRow;
  });

  // Validate required columns
  const sampleRow = data[0];
  const missingColumns = REQUIRED_COLUMNS.filter(
    (col) => !(col in sampleRow) || !sampleRow[col as keyof BulkRow]
  );

  if (missingColumns.length > 0) {
    throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
  }

  return data;
}

export async function bulkGenerateCertificates(
  rows: BulkRow[],
  companyId: string,
  adminId?: string
): Promise<BulkResult> {
  const result: BulkResult = {
    total: rows.length,
    successful: 0,
    failed: 0,
    results: [],
  };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    try {
      const input: CreateCertificateInput = {
        studentName: String(row.studentName).trim(),
        collegeName: row.collegeName ? String(row.collegeName).trim() : undefined,
        course: row.course ? String(row.course).trim() : undefined,
        internshipRole: String(row.internshipRole).trim(),
        projectName: row.projectName ? String(row.projectName).trim() : undefined,
        startDate: String(row.startDate),
        endDate: String(row.endDate),
        description: String(row.description),
        templateType: row.templateType || 'classic',
      };

      const certificate = await createCertificate(input, companyId);

      result.successful++;
      result.results.push({
        row: i + 2, // Excel row (header = 1)
        studentName: input.studentName,
        status: 'success',
        certificateId: certificate.certificateId,
      });
    } catch (error: any) {
      result.failed++;
      result.results.push({
        row: i + 2,
        studentName: row.studentName || 'Unknown',
        status: 'error',
        error: error.message,
      });
    }
  }

  // Log bulk activity
  await prisma.activityLog.create({
    data: {
      action: 'bulk_generated',
      details: `Bulk generation: ${result.successful}/${result.total} successful`,
      adminId: adminId || null,
      companyId,
    },
  });

  return result;
}

/**
 * Generate a sample Excel template for bulk upload
 */
export function generateSampleTemplate(): Buffer {
  const workbook = XLSX.utils.book_new();
  const sampleData = [
    {
      studentName: 'John Doe',
      collegeName: 'JC Bose University',
      course: 'B.Tech - Computer Engineering',
      internshipRole: 'MERN Stack developer',
      projectName: 'LookIntern Project',
      startDate: '2026-01-03',
      endDate: '2026-07-03',
      description: 'The internship certificate for a <strong>MERN Stack developer</strong> signifies successful completion of a hands-on development internship program from <strong>03-jan-2026 to 03-july-2026</strong>. During this period, he has demonstrated a strong understanding of <strong>Next.JS, Node, Express.js</strong> and contributed to the development of <strong>LookIntern Project</strong>.',
      templateType: 'andro',
    },
    {
      studentName: 'Jane Smith',
      collegeName: 'Stanford University',
      course: 'B.Des - Interaction Design',
      internshipRole: 'UI/UX Designer',
      projectName: 'Mobile App Redesign',
      startDate: '2026-02-01',
      endDate: '2026-07-31',
      description: 'This certificate is proudly awarded to Jane Smith for successfully completing a UI/UX Design Internship.',
      templateType: 'modern',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 20 }, { wch: 25 }, { wch: 25 }, { wch: 25 },
    { wch: 15 }, { wch: 15 }, { wch: 60 }, { wch: 12 },
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Certificates');
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
}
