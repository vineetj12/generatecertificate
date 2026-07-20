import { TemplateData } from './classic';

export function getAndroTemplate(data: TemplateData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1123, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=Montserrat:wght@400;500;600;700;800&family=Great+Vibes&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    @page {
      size: A4 landscape;
      margin: 0;
    }

    body {
      width: 1123px;
      height: 794px;
      font-family: 'Montserrat', sans-serif;
      background: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      position: relative;
      overflow: hidden;
    }

    /* Decorative Corner Designs */
    .corner-decor {
      position: absolute;
      pointer-events: none;
      z-index: 1;
    }

    /* Top Left Corner */
    .decor-tl-1 {
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      border-top: 55px solid #1e293b;
      border-right: 280px solid transparent;
    }
    .decor-tl-2 {
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      border-top: 25px solid #f59e0b;
      border-right: 180px solid transparent;
      z-index: 2;
    }

    /* Top Right Corner */
    .decor-tr-1 {
      top: 0;
      right: 0;
      width: 0;
      height: 0;
      border-top: 220px solid #f59e0b;
      border-left: 220px solid transparent;
    }
    .decor-tr-2 {
      top: 0;
      right: 0;
      width: 0;
      height: 0;
      border-top: 190px solid #1e293b;
      border-left: 190px solid transparent;
      z-index: 2;
    }

    /* Bottom Left Corner */
    .decor-bl-1 {
      bottom: 0;
      left: 0;
      width: 0;
      height: 0;
      border-bottom: 220px solid #f59e0b;
      border-right: 220px solid transparent;
    }
    .decor-bl-2 {
      bottom: 0;
      left: 0;
      width: 0;
      height: 0;
      border-bottom: 190px solid #1e293b;
      border-right: 190px solid transparent;
      z-index: 2;
    }

    /* Bottom Right Corner */
    .decor-br-1 {
      bottom: 0;
      right: 0;
      width: 0;
      height: 0;
      border-bottom: 50px solid #1e293b;
      border-left: 550px solid transparent;
    }
    .decor-br-2 {
      bottom: 0;
      right: 0;
      width: 0;
      height: 0;
      border-bottom: 25px solid #f59e0b;
      border-left: 380px solid transparent;
      z-index: 2;
    }

    /* Side Fine Line Ornaments */
    .ornament-left {
      position: absolute;
      left: 30px;
      top: 22%;
      width: 100px;
      height: 350px;
      opacity: 0.15;
      background: radial-gradient(circle at -20% 50%, transparent 60%, #1e293b 62%, transparent 64%);
      background-size: 30px 30px;
      z-index: 1;
    }

    .ornament-right {
      position: absolute;
      right: 25px;
      top: 25%;
      width: 100px;
      height: 350px;
      opacity: 0.15;
      background: radial-gradient(circle at 120% 50%, transparent 60%, #1e293b 62%, transparent 64%);
      background-size: 30px 30px;
      z-index: 1;
    }

    /* Main Certificate Area */
    .container {
      width: 100%;
      height: 100%;
      padding: 50px 70px 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      position: relative;
      z-index: 10;
    }

    /* Top Section with Logo and Company Title */
    .header {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-top: 10px;
    }

    .logo-container {
      position: relative;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 12px rgba(0,0,0,0.06);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 12;
      margin-left: 20px;
    }

    .logo-img {
      width: 85%;
      height: 85%;
      object-fit: contain;
      border-radius: 50%;
    }

    .company-header-container {
      flex: 1;
      text-align: center;
      padding-right: 120px; /* balance the logo width */
    }

    .company-title {
      font-size: 26px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 2px;
    }

    .cert-title {
      font-family: 'Playfair Display', serif;
      font-size: 42px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 6px;
    }

    /* Award Details */
    .award-subtitle {
      font-size: 15px;
      font-weight: 600;
      color: #334155;
      margin-bottom: 12px;
    }

    .recipient-name {
      font-family: 'Great Vibes', cursive;
      font-size: 58px;
      color: #0f172a;
      line-height: 1;
      margin-bottom: 10px;
    }

    .horizontal-divider {
      width: 520px;
      height: 1.5px;
      background: #0f172a;
      margin: 8px 0 16px;
    }

    .education-info {
      font-size: 17px;
      font-weight: 700;
      color: #e6a100;
      text-align: center;
      line-height: 1.5;
      margin-bottom: 18px;
    }

    /* Paragraph Wording */
    .description {
      max-width: 820px;
      font-size: 14px;
      line-height: 1.8;
      color: #1e293b;
      text-align: center;
      font-style: italic;
      margin-bottom: 24px;
    }

    .description strong {
      font-weight: 700;
      font-style: normal;
      color: #0f172a;
    }

    /* Footer Signatures and Badges */
    .footer-row {
      width: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-top: auto;
      padding: 0 10px;
    }

    .signature-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 250px;
    }

    .company-sig-title {
      font-size: 12px;
      font-weight: 700;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }

    .signature-image {
      width: 140px;
      height: 55px;
      object-fit: contain;
      margin-bottom: 4px;
    }

    .signature-line {
      width: 100%;
      height: 1px;
      background: #94a3b8;
      margin-bottom: 6px;
    }

    .director-label {
      font-size: 13px;
      font-weight: 700;
      color: #1e293b;
    }

    /* Certification Logos */
    .logos-container {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 5px;
    }

    .logo-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .logo-svg {
      height: 48px;
      object-fit: contain;
    }

    /* Government of India Logo details */
    .gov-india-logo {
      display: flex;
      align-items: center;
      gap: 6px;
      border-right: 1px solid #cbd5e1;
      padding-right: 15px;
    }
    .gov-logo-text {
      display: flex;
      flex-direction: column;
      font-size: 9px;
      font-weight: 800;
      color: #0c4a6e;
      text-transform: uppercase;
      line-height: 1.1;
      text-align: left;
    }
    .gov-logo-subtitle {
      font-size: 7px;
      color: #0284c7;
      letter-spacing: 0.5px;
    }

    /* MSME Logo details */
    .msme-logo-box {
      border-right: 1px solid #cbd5e1;
      padding-right: 15px;
      display: flex;
      align-items: center;
    }

    /* Certificate ID Badge */
    .cert-id-badge {
      background: #e2e8f0;
      color: #334155;
      font-size: 11px;
      font-weight: 600;
      padding: 6px 16px;
      border-radius: 4px;
      font-family: monospace;
      border: 1px solid #cbd5e1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 4px;
    }

    .qr-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .qr-image {
      width: 60px;
      height: 60px;
      border: 1px solid #e2e8f0;
      padding: 2px;
      background: white;
    }

  </style>
</head>
<body>
  <!-- Corner Shapes -->
  <div class="corner-decor decor-tl-1"></div>
  <div class="corner-decor decor-tl-2"></div>
  <div class="corner-decor decor-tr-1"></div>
  <div class="corner-decor decor-tr-2"></div>
  <div class="corner-decor decor-bl-1"></div>
  <div class="corner-decor decor-bl-2"></div>
  <div class="corner-decor decor-br-1"></div>
  <div class="corner-decor decor-br-2"></div>
  
  <!-- Subtle lines -->
  <div class="ornament-left"></div>
  <div class="ornament-right"></div>

  <div class="container">
    <!-- Header: Logo on the left, Titles in center -->
    <div class="header">
      <div class="logo-container">
        ${data.logoBase64 ? `<img class="logo-img" src="${data.logoBase64}" alt="Company Logo">` : ''}
      </div>
      <div class="company-header-container">
        <h2 class="company-title">${data.companyName}</h2>
        <h1 class="cert-title">Certificate of Internship</h1>
        <p class="award-subtitle">This certificate is proudly awarded to</p>
      </div>
    </div>

    <!-- Recipient Name & Underline -->
    <div class="recipient-name">${data.studentName}</div>
    <div class="horizontal-divider"></div>

    <!-- Education Info (Degree, Course & University) -->
    <div class="education-info">
      ${data.course ? `<div>${data.course}</div>` : ''}
      ${data.collegeName ? `<div>${data.collegeName}</div>` : ''}
    </div>

    <!-- Description Paragraph -->
    <div class="description">
      ${data.description}
    </div>

    <!-- Footer Row containing Signatures, Government Logos, and QR Verification -->
    <div class="footer-row">
      <!-- Signature -->
      <div class="signature-container">
        <span class="company-sig-title">${data.companyName}</span>
        ${data.signatureBase64 ? `<img class="signature-image" src="${data.signatureBase64}" alt="Signature">` : ''}
        <div class="signature-line"></div>
        <span class="director-label">Director</span>
      </div>

      <!-- Ministry and MSME / ISO logos -->
      <div class="logos-container">
        <!-- Ministry of Corporate Affairs Logo -->
        <div class="gov-india-logo">
          ${data.mcaLogoBase64 ? `<img class="logo-svg" src="${data.mcaLogoBase64}" alt="Ministry of Corporate Affairs">` : ''}
        </div>

        <!-- MSME Logo -->
        <div class="msme-logo-box">
          ${data.msmeLogoBase64 ? `<img class="logo-svg" src="${data.msmeLogoBase64}" alt="MSME">` : ''}
        </div>

        <!-- Certified ISO 9001:2015 Logo -->
        <div class="logo-item">
          <svg viewBox="0 0 48 48" width="48" height="48">
            <circle cx="24" cy="24" r="22" fill="none" stroke="#0f172a" stroke-width="1.5" />
            <circle cx="24" cy="24" r="19" fill="none" stroke="#0f172a" stroke-width="0.5" stroke-dasharray="2 1" />
            <text x="24" y="16" font-family="'Montserrat', sans-serif" font-weight="800" font-size="7" fill="#0f172a" text-anchor="middle">CERTIFIED</text>
            <rect x="6" y="19" width="36" height="10" fill="#0f172a" rx="1" />
            <text x="24" y="27" font-family="'Montserrat', sans-serif" font-weight="900" font-size="8" fill="#ffffff" text-anchor="middle">ISO</text>
            <text x="24" y="38" font-family="'Montserrat', sans-serif" font-weight="700" font-size="5" fill="#0f172a" text-anchor="middle">9001:2015</text>
            <text x="24" y="43" font-family="'Montserrat', sans-serif" font-weight="600" font-size="4" fill="#0f172a" text-anchor="middle">COMPANY</text>
          </svg>
        </div>
      </div>

      <!-- Certificate ID Badge & QR Verification -->
      <div class="qr-container">
        <div class="cert-id-badge">Certificate ID: ${data.certificateId}</div>
        ${data.qrCodeBase64 ? `<img class="qr-image" src="${data.qrCodeBase64}" alt="QR Verify">` : ''}
      </div>
    </div>
  </div>
</body>
</html>`;
}
