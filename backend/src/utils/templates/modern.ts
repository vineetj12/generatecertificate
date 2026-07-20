import { TemplateData } from './classic';

export function getModernTemplate(data: TemplateData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1123, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: A4 landscape; margin: 0; }
    body {
      width: 1123px;
      height: 794px;
      font-family: 'Outfit', sans-serif;
      background: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .certificate-wrapper {
      width: 1123px;
      height: 794px;
      position: relative;
      background: #ffffff;
      display: flex;
      overflow: hidden;
    }
    .left-panel {
      width: 340px;
      background: linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 30px;
      position: relative;
    }
    .left-panel::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 4px;
      height: 100%;
      background: linear-gradient(180deg, #6366f1, #8b5cf6, #a855f7);
    }
    .logo-container {
      width: 80px;
      height: 80px;
      border-radius: 16px;
      background: rgba(255,255,255,0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      border: 1px solid rgba(255,255,255,0.15);
    }
    .logo-img {
      width: 55px;
      height: 55px;
      object-fit: contain;
    }
    .company-name-left {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: #ffffff;
      text-align: center;
      letter-spacing: 1px;
      margin-bottom: 6px;
    }
    .company-info {
      font-size: 10px;
      color: rgba(255,255,255,0.5);
      text-align: center;
      line-height: 1.6;
      margin-bottom: 30px;
    }
    .qr-container {
      padding: 10px;
      background: #ffffff;
      border-radius: 12px;
      margin-bottom: 10px;
    }
    .qr-img { width: 100px; height: 100px; }
    .scan-text {
      font-size: 9px;
      color: rgba(255,255,255,0.4);
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .cert-id-left {
      font-size: 10px;
      color: rgba(255,255,255,0.6);
      font-family: 'Space Grotesk', sans-serif;
      margin-top: 4px;
      letter-spacing: 1px;
    }
    .right-panel {
      flex: 1;
      padding: 50px 50px 40px;
      display: flex;
      flex-direction: column;
    }
    .cert-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      background: linear-gradient(135deg, #ede9fe, #e0e7ff);
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      color: #6366f1;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 14px;
      width: fit-content;
    }
    .cert-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 32px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 4px;
    }
    .cert-subtitle {
      font-size: 14px;
      color: #94a3b8;
      margin-bottom: 22px;
    }
    .student-name-modern {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 34px;
      font-weight: 700;
      background: linear-gradient(135deg, #6366f1, #a855f7);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 6px;
    }
    .role-tag {
      display: inline-block;
      padding: 5px 18px;
      background: #0f172a;
      color: #fff;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      border-radius: 4px;
      margin-bottom: 18px;
    }
    .description-modern {
      font-size: 12.5px;
      line-height: 1.75;
      color: #475569;
      max-width: 640px;
      margin-bottom: 18px;
    }
    .description-modern p { margin-bottom: 4px; }
    .description-modern strong { color: #0f172a; font-weight: 600; }
    .details-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 22px;
    }
    .detail-card {
      padding: 10px 14px;
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    .detail-card-label {
      font-size: 9px;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 3px;
    }
    .detail-card-value {
      font-size: 12px;
      font-weight: 600;
      color: #0f172a;
    }
    .bottom-modern {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .date-section {
      text-align: left;
    }
    .date-label {
      font-size: 9px;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 3px;
    }
    .date-value {
      font-size: 13px;
      font-weight: 600;
      color: #0f172a;
    }
    .signature-modern {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .signature-img { width: 130px; height: 45px; object-fit: contain; margin-bottom: 4px; }
    .sig-line { width: 160px; height: 2px; background: linear-gradient(90deg, #6366f1, #a855f7); margin-bottom: 6px; border-radius: 1px; }
    .sig-name { font-size: 12px; font-weight: 600; color: #0f172a; }
    .sig-title { font-size: 10px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="certificate-wrapper">
    <div class="left-panel">
      <div class="logo-container">
        ${data.logoBase64 ? `<img class="logo-img" src="${data.logoBase64}" alt="Logo">` : ''}
      </div>
      <div class="company-name-left">${data.companyName}</div>
      <div class="company-info">
        ${data.companyAddress}<br>
        ${data.companyWebsite ? data.companyWebsite : ''}
      </div>
      <div class="qr-container">
        ${data.qrCodeBase64 ? `<img class="qr-img" src="${data.qrCodeBase64}" alt="QR">` : ''}
      </div>
      <div class="scan-text">Scan to verify</div>
      <div class="cert-id-left">${data.certificateId}</div>
    </div>
    <div class="right-panel">
      <div class="cert-badge">★ Certificate of Completion</div>
      <div class="cert-title">Internship Certificate</div>
      <div class="cert-subtitle">This certificate is awarded to</div>
      <div class="student-name-modern">${data.studentName}</div>
      <div class="role-tag">${data.internshipRole}</div>
      <div class="description-modern">${data.description}</div>
      <div class="details-grid">
        ${data.collegeName ? `<div class="detail-card">
          <div class="detail-card-label">College</div>
          <div class="detail-card-value">${data.collegeName}</div>
        </div>` : ''}
        ${data.projectName ? `<div class="detail-card">
          <div class="detail-card-label">Project</div>
          <div class="detail-card-value">${data.projectName}</div>
        </div>` : ''}
        <div class="detail-card">
          <div class="detail-card-label">Duration</div>
          <div class="detail-card-value">${data.startDate} — ${data.endDate}</div>
        </div>
      </div>
      <div class="bottom-modern">
        <div class="date-section">
          <div class="date-label">Date of Issue</div>
          <div class="date-value">${data.issueDate}</div>
        </div>

        <div class="certifications-modern" style="display: flex; align-items: center; gap: 12px; margin-bottom: 5px;">
          ${data.mcaLogoBase64 ? `<img src="${data.mcaLogoBase64}" alt="MCA Logo" style="height: 38px; object-fit: contain; opacity: 0.85; border-right: 1px solid #cbd5e1; padding-right: 8px;">` : ''}
          ${data.msmeLogoBase64 ? `<img src="${data.msmeLogoBase64}" alt="MSME Logo" style="height: 38px; object-fit: contain; opacity: 0.85;">` : ''}
        </div>

        <div class="signature-modern">
          ${data.signatureBase64 ? `<img class="signature-img" src="${data.signatureBase64}" alt="Signature">` : ''}
          <div class="sig-line"></div>
          <div class="sig-name">${data.directorName}</div>
          <div class="sig-title">Director</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}
