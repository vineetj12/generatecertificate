import { Request, Response } from 'express';
import { getCertificateByCertificateId, getCertificateById } from '../services/certificate.service';
import { generateCertificatePDFBuffer } from '../services/pdf.service';

export async function verifyCertificate(req: Request, res: Response): Promise<void> {
  try {
    const { certificateId } = req.params;

    // getCertificateByCertificateId now includes the company relation
    const certificate = await getCertificateByCertificateId(certificateId as string);

    if (!certificate) {
      res.json({
        success: true,
        data: {
          valid: false,
          status: 'Invalid',
          message: 'No certificate found with this ID',
        },
      });
      return;
    }

    const company = certificate.company;

    res.json({
      success: true,
      data: {
        valid: certificate.status === 'valid',
        status: certificate.status === 'valid' ? 'Valid' : 'Revoked',
        certificate: {
          dbId: certificate.id,
          certificateId: certificate.certificateId,
          studentName: certificate.studentName,
          collegeName: certificate.collegeName,
          course: certificate.course,
          internshipRole: certificate.internshipRole,
          projectName: certificate.projectName,
          startDate: certificate.startDate,
          endDate: certificate.endDate,
          issueDate: certificate.issueDate,
          companyName: company?.name || '',
          companyWebsite: company?.website || '',
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/** Public PDF download — no authentication needed; rate limited by certificate validity */
export async function publicDownload(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const certificate = await getCertificateById(id as string);

    if (!certificate) {
      res.status(404).json({ success: false, message: 'Certificate not found' });
      return;
    }

    if (certificate.status !== 'valid') {
      res.status(403).json({ success: false, message: 'Certificate has been revoked and cannot be downloaded' });
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
