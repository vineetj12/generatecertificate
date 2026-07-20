import QRCode from 'qrcode';

/**
 * Generate QR code as data URL for embedding in HTML templates
 */
export async function generateQRCodeDataUrl(certificateId: string): Promise<string> {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const verifyUrl = `${frontendUrl}/verify/${certificateId}`;

  return QRCode.toDataURL(verifyUrl, {
    width: 200,
    margin: 2,
    color: {
      dark: '#1a1a2e',
      light: '#ffffff',
    },
    errorCorrectionLevel: 'H',
  });
}
