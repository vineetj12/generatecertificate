import { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

export async function getCompany(req: AuthRequest, res: Response): Promise<void> {
  try {
    const companyId = req.admin!.companyId;
    const company = await prisma.company.findUnique({ where: { id: companyId } });

    if (!company) {
      res.status(404).json({ success: false, message: 'Company not found' });
      return;
    }

    const companyData = {
      ...company,
      logoUrl: company.logoPath || null,
      signatureUrl: company.signaturePath || null,
    };

    res.json({ success: true, data: companyData });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateCompany(req: AuthRequest, res: Response): Promise<void> {
  try {
    const companyId = req.admin!.companyId;
    const { name, address, website, email, directorName, certificatePrefix } = req.body;

    const company = await prisma.company.update({
      where: { id: companyId },
      data: {
        ...(name && { name }),
        ...(address !== undefined && { address }),
        ...(website !== undefined && { website }),
        ...(email !== undefined && { email }),
        ...(directorName !== undefined && { directorName }),
        ...(certificatePrefix && { certificatePrefix }),
      },
    });

    await prisma.activityLog.create({
      data: {
        action: 'company_updated',
        details: `Company settings updated: ${company.name}`,
        companyId,
      },
    });

    res.json({ success: true, data: company });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function uploadLogo(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    const companyId = req.admin!.companyId;
    const base64Data = req.file.buffer.toString('base64');
    const logoDataUrl = `data:${req.file.mimetype};base64,${base64Data}`;

    const company = await prisma.company.update({
      where: { id: companyId },
      data: { logoPath: logoDataUrl },
    });

    await prisma.activityLog.create({
      data: {
        action: 'logo_uploaded',
        details: 'Company logo uploaded',
        companyId,
      },
    });

    res.json({
      success: true,
      data: {
        logoPath: logoDataUrl,
        logoUrl: logoDataUrl,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function uploadSignature(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    const companyId = req.admin!.companyId;
    const base64Data = req.file.buffer.toString('base64');
    const signatureDataUrl = `data:${req.file.mimetype};base64,${base64Data}`;

    const company = await prisma.company.update({
      where: { id: companyId },
      data: { signaturePath: signatureDataUrl },
    });

    await prisma.activityLog.create({
      data: {
        action: 'signature_uploaded',
        details: 'Director signature uploaded',
        companyId,
      },
    });

    res.json({
      success: true,
      data: {
        signaturePath: signatureDataUrl,
        signatureUrl: signatureDataUrl,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
