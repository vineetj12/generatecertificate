import { TemplateData } from './classic';

export function getElegantTemplate(data: TemplateData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1123, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&family=Great+Vibes&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: A4 landscape; margin: 0; }
    body {
      width: 1123px;
      height: 794px;
      font-family: 'Montserrat', sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .certificate-wrapper {
      width: 1123px;
      height: 794px;
      position: relative;
      background: linear-gradient(135deg, #fdf6e3 0%, #fff8f0 30%, #fefcf3 70%, #fdf6e3 100%);
      overflow: hidden;
    }
    /* Gold ornamental borders */
    .border-outer {
      position: absolute;
      top: 20px; left: 20px; right: 20px; bottom: 20px;
      border: 2px solid #b8860b;
    }
    .border-middle {
      position: absolute;
      top: 26px; left: 26px; right: 26px; bottom: 26px;
      border: 1px solid #daa520;
    }
    .border-inner {
      position: absolute;
      top: 32px; left: 32px; right: 32px; bottom: 32px;
      border: 2px solid #b8860b;
    }
    /* Gold corner flourishes */
    .flourish { position: absolute; width: 80px; height: 80px; }
    .flourish::before, .flourish::after {
      content: '';
      position: absolute;
      background: #b8860b;
    }
    .flourish-tl { top: 36px; left: 36px; }
    .flourish-tl::before { top: 0; left: 0; width: 30px; height: 3px; }
    .flourish-tl::after { top: 0; left: 0; width: 3px; height: 30px; }
    .flourish-tr { top: 36px; right: 36px; }
    .flourish-tr::before { top: 0; right: 0; width: 30px; height: 3px; }
    .flourish-tr::after { top: 0; right: 0; width: 3px; height: 30px; }
    .flourish-bl { bottom: 36px; left: 36px; }
    .flourish-bl::before { bottom: 0; left: 0; width: 30px; height: 3px; }
    .flourish-bl::after { bottom: 0; left: 0; width: 3px; height: 30px; }
    .flourish-br { bottom: 36px; right: 36px; }
    .flourish-br::before { bottom: 0; right: 0; width: 30px; height: 3px; }
    .flourish-br::after { bottom: 0; right: 0; width: 3px; height: 30px; }
    .content {
      position: absolute;
      top: 50px; left: 70px; right: 70px; bottom: 50px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px 20px;
    }
    .top-section {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 6px;
    }
    .logo-img { width: 55px; height: 55px; object-fit: contain; }
    .company-header {
      font-family: 'Cormorant Garamond', serif;
      font-size: 20px;
      font-weight: 700;
      color: #3d2b1f;
      letter-spacing: 3px;
      text-transform: uppercase;
    }
    .gold-line {
      width: 350px;
      height: 1px;
      background: linear-gradient(90deg, transparent, #b8860b, #daa520, #b8860b, transparent);
      margin: 8px 0;
    }
    .cert-label {
      font-family: 'Cormorant Garamond', serif;
      font-size: 42px;
      font-weight: 700;
      color: #b8860b;
      letter-spacing: 8px;
      text-transform: uppercase;
      margin-bottom: 0;
    }
    .cert-of {
      font-family: 'Great Vibes', cursive;
      font-size: 22px;
      color: #8b6914;
      margin-bottom: 8px;
    }
    .presented-to {
      font-size: 11px;
      color: #8b7355;
      letter-spacing: 4px;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .student-name-elegant {
      font-family: 'Great Vibes', cursive;
      font-size: 44px;
      color: #3d2b1f;
      margin-bottom: 4px;
    }
    .role-elegant {
      display: inline-block;
      padding: 4px 28px;
      border: 2px solid #b8860b;
      color: #b8860b;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: 14px;
    }
    .desc-elegant {
      max-width: 720px;
      font-size: 11.5px;
      line-height: 1.75;
      color: #5a4a3a;
      text-align: center;
      margin-bottom: 12px;
    }
    .desc-elegant p { margin-bottom: 4px; }
    .desc-elegant strong { color: #3d2b1f; font-weight: 600; }
    .info-row {
      display: flex;
      justify-content: center;
      gap: 50px;
      margin-bottom: 16px;
    }
    .info-item { text-align: center; }
    .info-label {
      font-size: 8px;
      color: #b8860b;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 3px;
    }
    .info-value {
      font-family: 'Cormorant Garamond', serif;
      font-size: 13px;
      font-weight: 600;
      color: #3d2b1f;
    }
    .bottom-elegant {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: auto;
      padding: 0 10px;
    }
    .qr-elegant {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .qr-img { width: 75px; height: 75px; }
    .qr-label {
      font-size: 7px;
      color: #b8860b;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-top: 4px;
    }
    .cert-id-elegant {
      font-size: 8px;
      color: #8b7355;
      letter-spacing: 1px;
      margin-top: 2px;
    }
    .date-elegant { text-align: center; }
    .sig-elegant {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .sig-img { width: 130px; height: 45px; object-fit: contain; margin-bottom: 4px; }
    .sig-line-elegant {
      width: 170px;
      height: 1px;
      background: linear-gradient(90deg, transparent, #b8860b, transparent);
      margin-bottom: 6px;
    }
    .sig-name-elegant {
      font-family: 'Cormorant Garamond', serif;
      font-size: 13px;
      font-weight: 600;
      color: #3d2b1f;
    }
    .sig-title-elegant { font-size: 9px; color: #8b7355; }
    .watermark-elegant {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%) rotate(-25deg);
      font-family: 'Great Vibes', cursive;
      font-size: 120px;
      color: rgba(184, 134, 11, 0.03);
      pointer-events: none;
      white-space: nowrap;
    }
  </style>
</head>
<body>
  <div class="certificate-wrapper">
    <div class="border-outer"></div>
    <div class="border-middle"></div>
    <div class="border-inner"></div>
    <div class="flourish flourish-tl"></div>
    <div class="flourish flourish-tr"></div>
    <div class="flourish flourish-bl"></div>
    <div class="flourish flourish-br"></div>
    <div class="watermark-elegant">Certificate of Excellence</div>
    <div class="content">
      <div class="top-section">
        ${data.logoBase64 ? `<img class="logo-img" src="${data.logoBase64}" alt="Logo">` : ''}
        <span class="company-header">${data.companyName}</span>
      </div>
      <div class="gold-line"></div>
      <div class="cert-label">Certificate</div>
      <div class="cert-of">of Internship Completion</div>
      <div class="presented-to">This is presented to</div>
      <div class="student-name-elegant">${data.studentName}</div>
      <div class="role-elegant">${data.internshipRole}</div>
      <div class="desc-elegant">${data.description}</div>
      <div class="info-row">
        ${data.collegeName ? `<div class="info-item">
          <div class="info-label">College</div>
          <div class="info-value">${data.collegeName}</div>
        </div>` : ''}
        ${data.projectName ? `<div class="info-item">
          <div class="info-label">Project</div>
          <div class="info-value">${data.projectName}</div>
        </div>` : ''}
        <div class="info-item">
          <div class="info-label">Duration</div>
          <div class="info-value">${data.startDate} — ${data.endDate}</div>
        </div>
      </div>
      <div class="bottom-elegant">
        <div class="qr-elegant">
          ${data.qrCodeBase64 ? `<img class="qr-img" src="${data.qrCodeBase64}" alt="QR">` : ''}
          <div class="qr-label">Verify Certificate</div>
          <div class="cert-id-elegant">${data.certificateId}</div>
        </div>
        <div class="date-elegant">
          <div class="info-label">Date of Issue</div>
          <div class="info-value">${data.issueDate}</div>
        </div>
        <div class="certifications-elegant" style="display: flex; align-items: center; gap: 14px; margin-bottom: 5px;">
          ${data.mcaLogoBase64 ? `<img src="${data.mcaLogoBase64}" alt="MCA Logo" style="height: 40px; object-fit: contain; border-right: 1px solid #daa520; padding-right: 9px;">` : ''}
          ${data.msmeLogoBase64 ? `<img src="${data.msmeLogoBase64}" alt="MSME Logo" style="height: 40px; object-fit: contain;">` : ''}
        </div>
        <div class="sig-elegant">
          ${data.signatureBase64 ? `<img class="sig-img" src="${data.signatureBase64}" alt="Signature">` : ''}
          <div class="sig-line-elegant"></div>
          <div class="sig-name-elegant">${data.directorName}</div>
          <div class="sig-title-elegant">Director</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}
