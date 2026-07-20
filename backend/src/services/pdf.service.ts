import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { TemplateData } from '../utils/templates/classic';
import { getClassicTemplate } from '../utils/templates/classic';
import { getModernTemplate } from '../utils/templates/modern';
import { getElegantTemplate } from '../utils/templates/elegant';
import { getAndroTemplate } from '../utils/templates/andro';
import { generateQRCodeDataUrl } from '../utils/qrcode';
import prisma from '../lib/prisma';

function fileToBase64(filePath: string): string {
  if (!filePath || !fs.existsSync(filePath)) return '';
  const file = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const mimeMap: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
  };
  const mime = mimeMap[ext] || 'image/png';
  return `data:${mime};base64,${file.toString('base64')}`;
}

function getTemplate(templateType: string, data: TemplateData): string {
  switch (templateType) {
    case 'modern':
      return getModernTemplate(data);
    case 'elegant':
      return getElegantTemplate(data);
    case 'andro':
      return getAndroTemplate(data);
    case 'classic':
    default:
      return getClassicTemplate(data);
  }
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function formatIssueDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export async function generateCertificatePDFBuffer(certificateId: string): Promise<Buffer> {
  const certificate = await prisma.certificate.findUnique({
    where: { id: certificateId },
    include: { company: true },
  });

  if (!certificate) {
    throw new Error('Certificate not found');
  }

  const company = certificate.company;
  if (!company) {
    throw new Error('Company settings not configured');
  }

  const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

  // Convert images to base64 for embedding
  const effectiveLogoPath = certificate.logoPath || company.logoPath;
  const logoBase64 = effectiveLogoPath
    ? (effectiveLogoPath.startsWith('data:') 
       ? effectiveLogoPath 
       : fileToBase64(path.join(uploadsDir, effectiveLogoPath)))
    : '';
  const effectiveSignaturePath = certificate.signaturePath || company.signaturePath;
  const signatureBase64 = effectiveSignaturePath
    ? (effectiveSignaturePath.startsWith('data:') 
       ? effectiveSignaturePath 
       : fileToBase64(path.join(uploadsDir, effectiveSignaturePath)))
    : '';

  // Generate QR code as data URL
  const qrCodeBase64 = await generateQRCodeDataUrl(certificate.certificateId);

  const mcaLogoPath = path.join(__dirname, '..', 'assets', 'mca_logo.png');
  const msmeLogoPath = path.join(__dirname, '..', 'assets', 'msme_logo.png');
  const mcaLogoBase64 = fileToBase64(mcaLogoPath);
  const msmeLogoBase64 = fileToBase64(msmeLogoPath);

  const templateData: TemplateData = {
    certificateId: certificate.certificateId,
    studentName: certificate.studentName,
    collegeName: certificate.collegeName || '',
    course: certificate.course || '',
    internshipRole: certificate.internshipRole,
    projectName: certificate.projectName || '',
    startDate: formatDate(certificate.startDate),
    endDate: formatDate(certificate.endDate),
    description: certificate.description,
    companyName: company.name,
    companyAddress: company.address,
    companyWebsite: company.website || '',
    companyEmail: company.email || '',
    directorName: company.directorName || '',
    logoBase64,
    signatureBase64,
    qrCodeBase64,
    mcaLogoBase64,
    msmeLogoBase64,
    issueDate: formatIssueDate(certificate.issueDate),
  };

  const html = getTemplate(certificate.templateType, templateData);

  // Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ],
  });

  const page = await browser.newPage();
  
  await page.setContent(html, {
    waitUntil: 'networkidle0' as any,
    timeout: 30000,
  });

  const pdfBuffer = await page.pdf({
    format: 'a4',
    landscape: true,
    printBackground: true,
  });

  await browser.close();

  return Buffer.from(pdfBuffer);
}

export async function generateCertificatePDF(certificateId: string): Promise<string> {
  const buffer = await generateCertificatePDFBuffer(certificateId);
  const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
  const certsDir = path.join(uploadsDir, 'pdfs');
  
  if (!fs.existsSync(certsDir)) {
    fs.mkdirSync(certsDir, { recursive: true });
  }

  const filename = `certificate-${certificateId}.pdf`;
  const pdfFullPath = path.join(certsDir, filename);

  fs.writeFileSync(pdfFullPath, buffer);

  // Return relative path
  return `pdfs/${filename}`;
}

/**
 * Generate HTML preview (no PDF, returns HTML string)
 */
export async function generatePreviewHTML(data: {
  studentName: string;
  collegeName?: string;
  course?: string;
  internshipRole: string;
  projectName?: string;
  startDate: string;
  endDate: string;
  description: string;
  templateType?: string;
  certificateId?: string;
  logoBase64?: string;
  signatureBase64?: string;
}, companyId: string): Promise<string> {
  const company = await prisma.company.findUnique({ where: { id: companyId } });
  if (!company) {
    throw new Error('Company settings not configured');
  }

  const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

  const logoBase64 = data.logoBase64 || (company.logoPath
    ? (company.logoPath.startsWith('data:') ? company.logoPath : fileToBase64(path.join(uploadsDir, company.logoPath)))
    : '');
  const signatureBase64 = data.signatureBase64 || (company.signaturePath
    ? (company.signaturePath.startsWith('data:') ? company.signaturePath : fileToBase64(path.join(uploadsDir, company.signaturePath)))
    : '');

  const mcaLogoPath = path.join(__dirname, '..', 'assets', 'mca_logo.png');
  const msmeLogoPath = path.join(__dirname, '..', 'assets', 'msme_logo.png');
  const mcaLogoBase64 = fileToBase64(mcaLogoPath);
  const msmeLogoBase64 = fileToBase64(msmeLogoPath);

  const templateData: TemplateData = {
    certificateId: data.certificateId || 'PREVIEW-0000-000000',
    studentName: data.studentName,
    collegeName: data.collegeName || '',
    course: data.course || '',
    internshipRole: data.internshipRole,
    projectName: data.projectName || '',
    startDate: data.startDate,
    endDate: data.endDate,
    description: data.description,
    companyName: company.name,
    companyAddress: company.address,
    companyWebsite: company.website || '',
    companyEmail: company.email || '',
    directorName: company.directorName || '',
    logoBase64,
    signatureBase64,
    qrCodeBase64: '',
    mcaLogoBase64,
    msmeLogoBase64,
    issueDate: formatIssueDate(new Date()),
  };

  return getTemplate(data.templateType || 'classic', templateData);
}
