'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { VerificationResult } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import {
  CheckCircle,
  XCircle,
  Shield,
  User,
  Briefcase,
  GraduationCap,
  Calendar,
  Building2,
  Globe,
  FileCheck,
  AlertTriangle,
  Download,
  Loader2,
} from 'lucide-react';

export default function VerifyPage() {
  const params = useParams();
  const certificateId = params.certificateId as string;
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    verify();
  }, [certificateId]);

  const verify = async () => {
    try {
      const response = await fetch(`${API_URL}/verify/${certificateId}`);
      const data = await response.json();
      setResult(data.data);
    } catch (error) {
      console.error('Verification failed:', error);
      setResult({ valid: false, status: 'Error', message: 'Verification service unavailable' });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!result?.certificate?.dbId) return;
    setDownloading(true);
    try {
      const response = await fetch(`${API_URL}/verify/download/${result.certificate.dbId}`);
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Certificate-${result.certificate.certificateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download certificate PDF.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07071b] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-500 border-t-transparent mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Verifying certificate…</p>
        </div>
      </div>
    );
  }

  const cert = result?.certificate;

  return (
    <div className="min-h-screen bg-[#07071b] relative flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(100,60,255,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(50,120,255,0.06),transparent_50%)]" />

      <div className="w-full max-w-xl relative z-10 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Certificate Verification</h1>
          <p className="text-sm text-slate-500 mt-1.5">
            ID: <code className="text-indigo-400 font-mono font-semibold">{certificateId}</code>
          </p>
        </div>

        {/* Status + detail card */}
        <div className="rounded-2xl border border-white/5 bg-[#0d0d21]/60 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/40">
          {/* Status banner */}
          <div className={`px-6 py-6 text-center relative overflow-hidden ${
            result?.valid
              ? 'bg-gradient-to-r from-emerald-500/90 to-green-600/90'
              : 'bg-gradient-to-r from-red-500/90 to-rose-600/90'
          }`}>
            {/* Subtle glow layer */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08),transparent_70%)]" />
            <div className="relative flex items-center justify-center gap-3">
              {result?.valid ? (
                <CheckCircle className="w-9 h-9 text-white drop-shadow-lg" />
              ) : (
                <XCircle className="w-9 h-9 text-white drop-shadow-lg" />
              )}
              <span className="text-2xl font-extrabold text-white tracking-tight">
                {result?.valid
                  ? 'Valid Certificate'
                  : result?.status === 'Revoked'
                  ? 'Revoked Certificate'
                  : 'Invalid Certificate'}
              </span>
            </div>
            {!result?.valid && result?.message && (
              <p className="text-white/70 text-sm mt-2 relative font-medium">{result.message}</p>
            )}
          </div>

          {/* Certificate details */}
          {cert && (
            <div className="p-6 space-y-3">
              <DetailRow icon={User} label="Student Name" value={cert.studentName} highlight />
              <DetailRow icon={Briefcase} label="Internship Role" value={cert.internshipRole} />
              {cert.course && (
                <DetailRow icon={GraduationCap} label="Course / Degree" value={cert.course} />
              )}
              {cert.collegeName && (
                <DetailRow icon={GraduationCap} label="College / University" value={cert.collegeName} />
              )}
              {cert.projectName && (
                <DetailRow icon={FileCheck} label="Project" value={cert.projectName} />
              )}
              <DetailRow
                icon={Calendar}
                label="Duration"
                value={`${formatDate(cert.startDate)} — ${formatDate(cert.endDate)}`}
              />
              <DetailRow icon={Calendar} label="Issue Date" value={formatDate(cert.issueDate)} />

              <div className="pt-3 border-t border-white/5 space-y-3">
                <DetailRow icon={Building2} label="Issued By" value={cert.companyName} />
                {cert.companyWebsite && (
                  <DetailRow icon={Globe} label="Website" value={cert.companyWebsite} />
                )}
              </div>

              {/* Status badge */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-sm text-slate-500 font-medium">Status</span>
                <Badge variant={result.valid ? 'success' : 'destructive'} className="text-sm px-3 py-1">
                  {result.valid ? (
                    <><CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Valid</>
                  ) : (
                    <><AlertTriangle className="w-3.5 h-3.5 mr-1.5" /> {result.status}</>
                  )}
                </Badge>
              </div>

              {/* Download button — only for valid certificates */}
              {result.valid && cert.dbId && (
                <div className="pt-4 border-t border-white/5">
                  <Button
                    className="w-full h-12 text-base bg-gradient-to-r from-violet-600 to-indigo-600 border-0 shadow-lg shadow-indigo-500/20 rounded-xl font-semibold"
                    onClick={handleDownload}
                    disabled={downloading}
                  >
                    {downloading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating PDF…
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download Certificate PDF
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-center text-slate-600 mt-2">
                    Downloads the original certificate as a PDF document
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          This verification is provided by CertGen • Powered by secure QR technology
        </p>
      </div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: any;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 py-1">
      <Icon className="w-4 h-4 text-indigo-400/60 flex-shrink-0 mt-0.5" />
      <div className="flex items-start justify-between flex-1 min-w-0 gap-4">
        <span className="text-sm text-slate-500 flex-shrink-0 font-medium">{label}</span>
        <span className={`text-sm text-right truncate ${
          highlight
            ? 'font-bold text-white text-base'
            : 'font-semibold text-slate-300'
        }`}>
          {value}
        </span>
      </div>
    </div>
  );
}
