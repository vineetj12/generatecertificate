import prisma from '../lib/prisma';
import { generateCertificateId, checkDuplicate } from '../utils/certificate-id';

export interface CreateCertificateInput {
  studentName: string;
  collegeName?: string;
  course?: string;
  internshipRole: string;
  projectName?: string;
  startDate: string;
  endDate: string;
  description: string;
  templateType?: string;
  internPhone?: string;
}

export async function createCertificate(input: CreateCertificateInput, companyId: string) {
  // Check for duplicates within this company
  const isDuplicate = await checkDuplicate(
    input.studentName,
    input.internshipRole,
    new Date(input.startDate),
    new Date(input.endDate),
    companyId
  );

  if (isDuplicate) {
    throw new Error(
      `A certificate already exists for ${input.studentName} as ${input.internshipRole} for the specified dates.`
    );
  }

  let certificate: any = null;
  let retries = 5;
  while (retries > 0) {
    const certificateId = await generateCertificateId(companyId);
    try {
      // Create certificate record
      certificate = await prisma.certificate.create({
        data: {
          certificateId,
          studentName: input.studentName,
          collegeName: input.collegeName || null,
          course: input.course || null,
          internshipRole: input.internshipRole,
          projectName: input.projectName || null,
          startDate: new Date(input.startDate),
          endDate: new Date(input.endDate),
          description: input.description,
          templateType: input.templateType || 'classic',
          internPhone: input.internPhone || null,
          companyId,
        },
      });

      // Log activity
      await prisma.activityLog.create({
        data: {
          action: 'created',
          details: `Certificate ${certificateId} generated for ${input.studentName}`,
          companyId,
        },
      });

      break;
    } catch (error: any) {
      if (error.code === 'P2002' && error.meta?.target?.includes('certificate_id')) {
        retries--;
        if (retries === 0) {
          throw error;
        }
        continue;
      }
      throw error;
    }
  }

  if (!certificate) {
    throw new Error('Failed to generate a unique certificate ID after multiple attempts');
  }

  return certificate;
}

export async function getCertificateById(id: string, companyId?: string) {
  const where: any = { id };
  if (companyId) {
    where.companyId = companyId;
  }
  return prisma.certificate.findFirst({ where });
}

export async function getCertificateByCertificateId(certificateId: string) {
  return prisma.certificate.findUnique({
    where: { certificateId },
    include: { company: true },
  });
}

export async function listCertificates(params: {
  page?: number;
  limit?: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  companyId: string;
}) {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;

  const where: any = { companyId: params.companyId };

  if (params.search) {
    where.OR = [
      { studentName: { contains: params.search, mode: 'insensitive' } },
      { certificateId: { contains: params.search, mode: 'insensitive' } },
      { internshipRole: { contains: params.search, mode: 'insensitive' } },
      { collegeName: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  if (params.dateFrom || params.dateTo) {
    where.createdAt = {};
    if (params.dateFrom) {
      where.createdAt.gte = new Date(params.dateFrom);
    }
    if (params.dateTo) {
      where.createdAt.lte = new Date(params.dateTo + 'T23:59:59.999Z');
    }
  }

  if (params.status) {
    where.status = params.status;
  }

  const [certificates, total] = await Promise.all([
    prisma.certificate.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.certificate.count({ where }),
  ]);

  return {
    certificates,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function deleteCertificate(id: string, companyId: string) {
  const certificate = await prisma.certificate.findFirst({ where: { id, companyId } });
  if (!certificate) {
    throw new Error('Certificate not found');
  }

  // Soft delete - set status to revoked
  const updated = await prisma.certificate.update({
    where: { id },
    data: { status: 'revoked' },
  });

  await prisma.activityLog.create({
    data: {
      action: 'deleted',
      details: `Certificate ${certificate.certificateId} revoked for ${certificate.studentName}`,
      companyId,
    },
  });

  return updated;
}

export async function getStatistics(companyId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [total, todayCount, monthCount, validCount, revokedCount, recentCertificates] = await Promise.all([
    prisma.certificate.count({ where: { companyId } }),
    prisma.certificate.count({
      where: { companyId, createdAt: { gte: today } },
    }),
    prisma.certificate.count({
      where: { companyId, createdAt: { gte: thisMonth } },
    }),
    prisma.certificate.count({
      where: { companyId, status: 'valid' },
    }),
    prisma.certificate.count({
      where: { companyId, status: 'revoked' },
    }),
    prisma.certificate.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  // Monthly trend for last 6 months
  const monthlyTrend = [];
  for (let i = 5; i >= 0; i--) {
    const start = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const end = new Date(today.getFullYear(), today.getMonth() - i + 1, 0, 23, 59, 59);
    const count = await prisma.certificate.count({
      where: {
        companyId,
        createdAt: { gte: start, lte: end },
      },
    });
    monthlyTrend.push({
      month: start.toLocaleString('default', { month: 'short', year: 'numeric' }),
      count,
    });
  }

  // Role distribution
  const roleDistribution = await prisma.certificate.groupBy({
    by: ['internshipRole'],
    where: { companyId },
    _count: { internshipRole: true },
    orderBy: { _count: { internshipRole: 'desc' } },
    take: 5,
  });

  return {
    total,
    todayCount,
    monthCount,
    validCount,
    revokedCount,
    recentCertificates,
    monthlyTrend,
    roleDistribution: roleDistribution.map((r) => ({
      role: r.internshipRole,
      count: r._count.internshipRole,
    })),
  };
}
