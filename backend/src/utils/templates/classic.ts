export interface TemplateData {
  certificateId: string;
  studentName: string;
  collegeName: string;
  course: string;
  internshipRole: string;
  projectName: string;
  startDate: string;
  endDate: string;
  description: string;
  companyName: string;
  companyAddress: string;
  companyWebsite: string;
  companyEmail: string;
  directorName: string;
  logoBase64: string;
  signatureBase64: string;
  qrCodeBase64: string;
  mcaLogoBase64: string;
  msmeLogoBase64: string;
  issueDate: string;
}

export function getClassicTemplate(data: TemplateData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1123, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Inter:wght@300;400;500;600&family=Great+Vibes&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    @page {
      size: A4 landscape;
      margin: 0;
    }

    body {
      width: 1123px;
      height: 794px;
      font-family: 'Inter', sans-serif;
      background: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .certificate-wrapper {
      width: 1123px;
      height: 794px;
      position: relative;
      background: linear-gradient(135deg, #fefefe 0%, #f8f6f0 100%);
      overflow: hidden;
    }

    /* Decorative border */
    .outer-border {
      position: absolute;
      top: 15px;
      left: 15px;
      right: 15px;
      bottom: 15px;
      border: 3px solid #1a1a2e;
    }

    .inner-border {
      position: absolute;
      top: 22px;
      left: 22px;
      right: 22px;
      bottom: 22px;
      border: 1px solid #c9a96e;
    }

    /* Corner ornaments */
    .corner {
      position: absolute;
      width: 60px;
      height: 60px;
      border-color: #c9a96e;
    }
    .corner-tl { top: 28px; left: 28px; border-top: 3px solid #c9a96e; border-left: 3px solid #c9a96e; }
    .corner-tr { top: 28px; right: 28px; border-top: 3px solid #c9a96e; border-right: 3px solid #c9a96e; }
    .corner-bl { bottom: 28px; left: 28px; border-bottom: 3px solid #c9a96e; border-left: 3px solid #c9a96e; }
    .corner-br { bottom: 28px; right: 28px; border-bottom: 3px solid #c9a96e; border-right: 3px solid #c9a96e; }

    .content {
      position: absolute;
      top: 40px;
      left: 50px;
      right: 50px;
      bottom: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px 30px;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 8px;
    }

    .logo-img {
      width: 60px;
      height: 60px;
      object-fit: contain;
    }

    .company-name-header {
      font-family: 'Playfair Display', serif;
      font-size: 22px;
      font-weight: 700;
      color: #1a1a2e;
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    .divider {
      width: 200px;
      height: 2px;
      background: linear-gradient(90deg, transparent, #c9a96e, transparent);
      margin: 8px 0;
    }

    .certificate-title {
      font-family: 'Playfair Display', serif;
      font-size: 38px;
      font-weight: 800;
      color: #1a1a2e;
      letter-spacing: 6px;
      text-transform: uppercase;
      margin-bottom: 2px;
    }

    .certificate-subtitle {
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 400;
      color: #666;
      letter-spacing: 4px;
      text-transform: uppercase;
      margin-bottom: 12px;
    }

    .awarded-to {
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      color: #888;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: 6px;
    }

    .student-name {
      font-family: 'Playfair Display', serif;
      font-size: 36px;
      font-weight: 700;
      color: #c9a96e;
      margin-bottom: 6px;
    }

    .role-badge {
      display: inline-block;
      padding: 4px 24px;
      background: #1a1a2e;
      color: #ffffff;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
      border-radius: 2px;
      margin-bottom: 14px;
    }

    .description {
      max-width: 780px;
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      line-height: 1.7;
      color: #444;
      text-align: center;
      margin-bottom: 10px;
    }

    .description p { margin-bottom: 4px; }
    .description strong { font-weight: 600; color: #1a1a2e; }
    .description em { font-style: italic; }

    .details-row {
      display: flex;
      justify-content: center;
      gap: 40px;
      margin-bottom: 16px;
    }

    .detail-item {
      text-align: center;
    }

    .detail-label {
      font-size: 9px;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 3px;
    }

    .detail-value {
      font-size: 12px;
      font-weight: 600;
      color: #1a1a2e;
    }

    .bottom-section {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: auto;
      padding: 0 20px;
    }

    .qr-section {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .qr-img {
      width: 80px;
      height: 80px;
    }

    .cert-id {
      font-size: 8px;
      color: #999;
      margin-top: 4px;
      letter-spacing: 1px;
    }

    .signature-section {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .signature-img {
      width: 140px;
      height: 50px;
      object-fit: contain;
      margin-bottom: 4px;
    }

    .signature-line {
      width: 180px;
      height: 1px;
      background: #1a1a2e;
      margin-bottom: 6px;
    }

    .director-name {
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      font-weight: 600;
      color: #1a1a2e;
    }

    .director-title {
      font-size: 10px;
      color: #888;
    }

    .issue-date-section {
      text-align: center;
    }

    .issue-label {
      font-size: 9px;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 3px;
    }

    .issue-value {
      font-size: 12px;
      font-weight: 600;
      color: #1a1a2e;
    }

    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      font-family: 'Playfair Display', serif;
      font-size: 100px;
      color: rgba(201, 169, 110, 0.04);
      letter-spacing: 20px;
      text-transform: uppercase;
      pointer-events: none;
      white-space: nowrap;
    }
  </style>
</head>
<body>
  <div class="certificate-wrapper">
    <div class="outer-border"></div>
    <div class="inner-border"></div>
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>
    <div class="watermark">CERTIFICATE</div>

    <div class="content">
      <div class="logo-section">
        ${data.logoBase64 ? `<img class="logo-img" src="${data.logoBase64}" alt="Company Logo">` : ''}
        <span class="company-name-header">${data.companyName}</span>
      </div>

      <div class="divider"></div>

      <div class="certificate-title">Certificate</div>
      <div class="certificate-subtitle">of Internship Completion</div>

      <div class="awarded-to">This is proudly awarded to</div>
      <div class="student-name">${data.studentName}</div>
      <div class="role-badge">${data.internshipRole}</div>

      <div class="description">${data.description}</div>

      <div class="details-row">
        ${data.collegeName ? `<div class="detail-item">
          <div class="detail-label">College</div>
          <div class="detail-value">${data.collegeName}</div>
        </div>` : ''}
        ${data.projectName ? `<div class="detail-item">
          <div class="detail-label">Project</div>
          <div class="detail-value">${data.projectName}</div>
        </div>` : ''}
        <div class="detail-item">
          <div class="detail-label">Duration</div>
          <div class="detail-value">${data.startDate} — ${data.endDate}</div>
        </div>
      </div>

      <div class="bottom-section">
        <div class="qr-section">
          ${data.qrCodeBase64 ? `<img class="qr-img" src="${data.qrCodeBase64}" alt="QR Code">` : ''}
          <div class="cert-id">${data.certificateId}</div>
        </div>

        <div class="certifications-section" style="display: flex; align-items: center; gap: 15px; margin-bottom: 5px;">
          ${data.mcaLogoBase64 ? `<img src="${data.mcaLogoBase64}" alt="MCA Logo" style="height: 42px; object-fit: contain; border-right: 1px solid #c9a96e; padding-right: 10px;">` : ''}
          ${data.msmeLogoBase64 ? `<img src="${data.msmeLogoBase64}" alt="MSME Logo" style="height: 42px; object-fit: contain;">` : ''}
        </div>

        <div class="issue-date-section">
          <div class="issue-label">Date of Issue</div>
          <div class="issue-value">${data.issueDate}</div>
        </div>

        <div class="signature-section">
          ${data.signatureBase64 ? `<img class="signature-img" src="${data.signatureBase64}" alt="Signature">` : ''}
          <div class="signature-line"></div>
          <div class="director-name">${data.directorName}</div>
          <div class="director-title">Director</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}
