'use client';

import { useEffect, useState, useRef } from 'react';
import { api } from '@/lib/api';
import { Company } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Save,
  Upload,
  Building2,
  Image as ImageIcon,
  Pen,
  CheckCircle,
} from 'lucide-react';

export default function SettingsPage() {
  const [company, setCompany] = useState<Partial<Company>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingSig, setUploadingSig] = useState(false);
  const [message, setMessage] = useState('');
  const logoInputRef = useRef<HTMLInputElement>(null);
  const sigInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadCompany();
  }, []);

  const loadCompany = async () => {
    try {
      const response = await api.company.get();
      setCompany(response.data);
    } catch (error) {
      console.error('Failed to load company:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await api.company.update({
        name: company.name,
        address: company.address,
        website: company.website,
        email: company.email,
        directorName: company.directorName,
        certificatePrefix: company.certificatePrefix,
      });
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage('Error: ' + (error.message || 'Failed to save'));
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const response = await api.company.uploadLogo(file);
      setCompany((prev) => ({ ...prev, logoUrl: response.data.logoUrl }));
      setMessage('Logo uploaded!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage('Error: ' + (error.message || 'Upload failed'));
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSignatureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingSig(true);
    try {
      const response = await api.company.uploadSignature(file);
      setCompany((prev) => ({ ...prev, signatureUrl: response.data.signatureUrl }));
      setMessage('Signature uploaded!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage('Error: ' + (error.message || 'Upload failed'));
    } finally {
      setUploadingSig(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-10 w-64 bg-slate-200 dark:bg-white/5 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-48 bg-slate-200 dark:bg-white/5 rounded-2xl" />
          <div className="h-48 bg-slate-200 dark:bg-white/5 rounded-2xl" />
        </div>
        <div className="h-96 bg-slate-200 dark:bg-white/5 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text">Company Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure default company metadata and upload authorized seal logos and signatures.
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-sm flex items-center gap-3 animate-fade-in font-medium ${
          message.startsWith('Error')
            ? 'bg-red-500/10 text-red-400 border border-red-500/25'
            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
        }`}>
          <CheckCircle className="w-4 h-4 flex-shrink-0" /> {message}
        </div>
      )}

      <div className="space-y-8">
        {/* Logo & Signature uploads */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Logo */}
          <div className="rounded-2xl border border-slate-200/10 dark:border-white/5 bg-white/5 dark:bg-[#0d0d21]/30 backdrop-blur-md p-6 flex flex-col justify-between group transition-all duration-300 hover:border-indigo-500/20">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="w-4 h-4 text-indigo-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Company Seal Logo</h3>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-slate-200/20 dark:border-white/10 flex items-center justify-center overflow-hidden bg-[#070714] p-3 transition-colors group-hover:border-indigo-500/30">
                {company.logoUrl ? (
                  <img src={company.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-500 opacity-40" />
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => logoInputRef.current?.click()}
                isLoading={uploadingLogo}
                className="rounded-xl border-white/10 text-slate-300 bg-white/5 hover:bg-white/10 w-full"
              >
                <Upload className="w-4 h-4 mr-2" /> Upload Seal
              </Button>
              <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </div>
          </div>

          {/* Signature */}
          <div className="rounded-2xl border border-slate-200/10 dark:border-white/5 bg-white/5 dark:bg-[#0d0d21]/30 backdrop-blur-md p-6 flex flex-col justify-between group transition-all duration-300 hover:border-indigo-500/20">
            <div className="flex items-center gap-2 mb-4">
              <Pen className="w-4 h-4 text-indigo-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Authorized Signature</h3>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="w-44 h-28 rounded-2xl border-2 border-dashed border-slate-200/20 dark:border-white/10 flex items-center justify-center overflow-hidden bg-[#070714] p-3 transition-colors group-hover:border-indigo-500/30">
                {company.signatureUrl ? (
                  <img src={company.signatureUrl} alt="Signature" className="w-full h-full object-contain" />
                ) : (
                  <Pen className="w-8 h-8 text-slate-500 opacity-40" />
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => sigInputRef.current?.click()}
                isLoading={uploadingSig}
                className="rounded-xl border-white/10 text-slate-300 bg-white/5 hover:bg-white/10 w-full"
              >
                <Upload className="w-4 h-4 mr-2" /> Upload Sign
              </Button>
              <input ref={sigInputRef} type="file" accept="image/*" onChange={handleSignatureUpload} className="hidden" />
            </div>
          </div>
        </div>

        {/* Company details form */}
        <div className="rounded-2xl border border-slate-200/10 dark:border-white/5 bg-white/5 dark:bg-[#0d0d21]/30 backdrop-blur-md p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Company Metadata</h3>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Company Name</Label>
                <Input
                  value={company.name || ''}
                  onChange={(e) => setCompany({ ...company, name: e.target.value })}
                  placeholder="TechCorp Solutions"
                  className="glass-input h-11 focus-visible:ring-0 text-white rounded-xl placeholder-slate-600 border-white/5"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Certificate Prefix</Label>
                <Input
                  value={company.certificatePrefix || ''}
                  onChange={(e) => setCompany({ ...company, certificatePrefix: e.target.value.toUpperCase() })}
                  placeholder="TECH"
                  maxLength={6}
                  className="glass-input h-11 focus-visible:ring-0 text-white rounded-xl placeholder-slate-600 border-white/5"
                />
                <p className="text-[10px] text-slate-500 mt-1">Used in certificate IDs (e.g., TECH-2026-000001)</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Company Address</Label>
              <Input
                value={company.address || ''}
                onChange={(e) => setCompany({ ...company, address: e.target.value })}
                placeholder="123 Innovation Drive, Silicon Valley, CA"
                className="glass-input h-11 focus-visible:ring-0 text-white rounded-xl placeholder-slate-600 border-white/5"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Website</Label>
                <Input
                  value={company.website || ''}
                  onChange={(e) => setCompany({ ...company, website: e.target.value })}
                  placeholder="https://techcorp.com"
                  className="glass-input h-11 focus-visible:ring-0 text-white rounded-xl placeholder-slate-600 border-white/5"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Email Address</Label>
                <Input
                  value={company.email || ''}
                  onChange={(e) => setCompany({ ...company, email: e.target.value })}
                  placeholder="info@techcorp.com"
                  className="glass-input h-11 focus-visible:ring-0 text-white rounded-xl placeholder-slate-600 border-white/5"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Director / Signatory Name</Label>
              <Input
                value={company.directorName || ''}
                onChange={(e) => setCompany({ ...company, directorName: e.target.value })}
                placeholder="John Smith"
                className="glass-input h-11 focus-visible:ring-0 text-white rounded-xl placeholder-slate-600 border-white/5"
              />
            </div>

            <Button onClick={handleSave} isLoading={saving} className="bg-gradient-to-r from-violet-600 to-indigo-600 border-0 h-12 shadow-lg shadow-indigo-500/20 rounded-xl font-semibold w-full sm:w-auto px-6 mt-4">
              <Save className="w-4 h-4 mr-2" /> Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
