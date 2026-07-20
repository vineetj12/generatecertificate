import prisma from '../lib/prisma';

/**
 * Generates a unique certificate ID in format: PREFIX-YEAR-SEQUENCE
 * e.g., TECH-2026-000001
 * Scoped per company so each company has its own sequence.
 */
export async function generateCertificateId(companyId: string): Promise<string> {
  const company = await prisma.company.findUnique({ where: { id: companyId } });
  const prefix = company?.certificatePrefix || 'COMP';
  const year = new Date().getFullYear();

  // Find the latest certificate for this company and year
  const latestCert = await prisma.certificate.findFirst({
    where: {
      companyId,
      certificateId: {
        startsWith: `${prefix}-${year}-`,
      },
    },
    orderBy: {
      certificateId: 'desc',
    },
  });

  let sequence = 1;
  if (latestCert) {
    const parts = latestCert.certificateId.split('-');
    const lastSequence = parseInt(parts[2], 10);
    sequence = lastSequence + 1;
  }

  const paddedSequence = sequence.toString().padStart(6, '0');
  return `${prefix}-${year}-${paddedSequence}`;
}

/**
 * Checks if a certificate with similar details already exists within the same company (duplicate detection)
 */
export async function checkDuplicate(
  studentName: string,
  internshipRole: string,
  startDate: Date,
  endDate: Date,
  companyId: string
): Promise<boolean> {
  const existing = await prisma.certificate.findFirst({
    where: {
      companyId,
      studentName: { equals: studentName, mode: 'insensitive' },
      internshipRole: { equals: internshipRole, mode: 'insensitive' },
      startDate,
      endDate,
      status: 'valid',
    },
  });

  return !!existing;
}
