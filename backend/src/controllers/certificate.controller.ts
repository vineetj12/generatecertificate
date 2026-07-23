import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import {
  createCertificate,
  getCertificateById,
  listCertificates,
  deleteCertificate,
  getStatistics,
} from '../services/certificate.service';
import { generatePreviewHTML, generateCertificatePDFBuffer } from '../services/pdf.service';

import { generateSampleTemplate, parseExcel, bulkGenerateCertificates } from '../services/bulk.service';
import { AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const createCertificateSchema = z.object({
  studentName: z.string().min(1, 'Student name is required'),
  collegeName: z.string().optional(),
  course: z.string().optional(),
  internshipRole: z.string().min(1, 'Internship role is required'),
  projectName: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  description: z.string().min(1, 'Description is required'),
  templateType: z.enum(['classic', 'modern', 'elegant', 'andro']).optional().default('classic'),
  internPhone: z.string().optional(),
});

export async function create(req: AuthRequest, res: Response): Promise<void> {
  try {
    const validation = createCertificateSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.error.errors,
      });
      return;
    }

    const companyId = req.admin!.companyId;
    const certificate = await createCertificate(validation.data, companyId);

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    res.status(201).json({
      success: true,
      data: {
        ...certificate,
        pdfUrl: `${baseUrl}/api/certificate/download/${certificate.id}`,
      },
      message: `Certificate ${certificate.certificateId} generated successfully`,
    });
  } catch (error: any) {
    res.status(error.message.includes('already exists') ? 409 : 500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const companyId = req.admin!.companyId;
    const certificate = await getCertificateById(req.params.id as string, companyId);
    if (!certificate) {
      res.status(404).json({ success: false, message: 'Certificate not found' });
      return;
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    res.json({
      success: true,
      data: {
        ...certificate,
        pdfUrl: `${baseUrl}/api/certificate/download/${certificate.id}`,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function list(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { page, limit, search, dateFrom, dateTo, status } = req.query;
    const companyId = req.admin!.companyId;

    const result = await listCertificates({
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 10,
      search: search as string,
      dateFrom: dateFrom as string,
      dateTo: dateTo as string,
      status: status as string,
      companyId,
    });

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const certificates = result.certificates.map((cert) => ({
      ...cert,
      pdfUrl: `${baseUrl}/api/certificate/download/${cert.id}`,
    }));

    res.json({
      success: true,
      data: certificates,
      pagination: result.pagination,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function download(req: AuthRequest, res: Response): Promise<void> {
  try {
    const certificate = await getCertificateById(req.params.id as string);
    if (!certificate) {
      res.status(404).json({ success: false, message: 'Certificate not found' });
      return;
    }

    const pdfBuffer = await generateCertificatePDFBuffer(certificate.id);
    const filename = `Certificate-${certificate.certificateId}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function remove(req: AuthRequest, res: Response): Promise<void> {
  try {
    const companyId = req.admin!.companyId;
    const certificate = await deleteCertificate(req.params.id as string, companyId);
    res.json({
      success: true,
      data: certificate,
      message: `Certificate ${certificate.certificateId} has been revoked`,
    });
  } catch (error: any) {
    res.status(error.message === 'Certificate not found' ? 404 : 500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function stats(req: AuthRequest, res: Response): Promise<void> {
  try {
    const companyId = req.admin!.companyId;
    const statistics = await getStatistics(companyId);
    res.json({ success: true, data: statistics });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function preview(req: AuthRequest, res: Response): Promise<void> {
  try {
    const companyId = req.admin!.companyId;
    const html = await generatePreviewHTML(req.body, companyId);
    res.json({ success: true, data: { html } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}





export async function downloadTemplate(_req: Request, res: Response): Promise<void> {
  try {
    const buffer = generateSampleTemplate();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="certificate-template.xlsx"');
    res.send(buffer);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function regeneratePdf(req: Request, res: Response): Promise<void> {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const id = req.params.id as string;
    res.json({
      success: true,
      message: 'PDF is dynamically generated on-demand',
      data: {
        pdfPath: null,
        pdfUrl: `${baseUrl}/api/certificate/download/${id}`,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function bulkCreate(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No Excel file uploaded' });
      return;
    }

    const rows = parseExcel(req.file.buffer);

    if (rows.length === 0) {
      res.status(400).json({ success: false, message: 'Excel file contains no data rows' });
      return;
    }

    const companyId = req.admin!.companyId;
    const result = await bulkGenerateCertificates(rows, companyId, req.admin?.id);

    res.status(201).json({
      success: true,
      data: result,
      message: `Bulk generation complete: ${result.successful}/${result.total} successful`,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}
