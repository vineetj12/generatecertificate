'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  FileCheck,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  Mail,
  User,
  Building2,
  Globe,
  MapPin,
  Pen,
  Upload,
  Image as ImageIcon,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { PhoneInput } from '@/components/ui/phone-input';


export default function SignupPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { signup } = useAuth();

  // Admin Account Details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Company Details
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [directorName, setDirectorName] = useState('');
  const [certificatePrefix, setCertificatePrefix] = useState('');

  // Branding Files (stored as base64 string)
  const [logoData, setLogoData] = useState<string | null>(null);
  const [signatureData, setSignatureData] = useState<string | null>(null);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Logo file size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoData(reader.result as string);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleSignatureFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Signature file size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSignatureData(reader.result as string);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const nextStep = () => {
    setError('');
    if (step === 1) {
      if (!name || !email || !password || !confirmPassword) {
        setError('All fields are required');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    } else if (step === 2) {
      if (!companyName || !certificatePrefix) {
        setError('Company Name and Certificate Prefix are required');
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signup({
        name,
        email,
        password,
        companyName,
        companyAddress,
        companyWebsite: companyWebsite || undefined,
        companyEmail: companyEmail || undefined,
        companyPhone: companyPhone || undefined,
        directorName: directorName || undefined,
        certificatePrefix,
        logoData: logoData || undefined,
        signatureData: signatureData || undefined,
      });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#07071b]">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/90 via-indigo-600/80 to-purple-700/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(120,50,255,0.4),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(60,120,255,0.3),transparent_50%)]" />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        {/* Animated glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-indigo-400/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-purple-400/15 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-2xl shadow-indigo-500/20">
              <FileCheck className="w-9 h-9 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">CertGen</h1>
              <p className="text-sm text-white/50 font-medium">Certificate Generator</p>
            </div>
          </div>

          <h2 className="text-5xl font-extrabold text-white leading-[1.1] mb-5 tracking-tight">
            Register Your<br />
            Company &<br />
            Start Issuing
          </h2>
          <p className="text-lg text-white/60 max-w-md leading-relaxed">
            Create a dedicated tenant workspace. Manage templates, upload custom signatures and branding seals, and issue verifiable digital credentials under your own prefix.
          </p>

          <div className="mt-10 max-w-md">
            <div className="flex flex-col gap-4">
              {[
                { label: 'Admin Setup', desc: 'Create your owner administrator account', stepNum: 1 },
                { label: 'Company Metadata', desc: 'Configure address, website, and prefix', stepNum: 2 },
                { label: 'Brand Assets', desc: 'Upload signature and authorization seal', stepNum: 3 },
              ].map((item) => (
                <div key={item.stepNum} className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border transition-all duration-300 ${
                    step >= item.stepNum
                      ? 'bg-white border-white text-indigo-600 shadow-lg'
                      : 'border-white/20 text-white/40'
                  }`}>
                    {step > item.stepNum ? '✓' : item.stepNum}
                  </div>
                  <div>
                    <h4 className={`font-bold text-sm transition-colors duration-300 ${step >= item.stepNum ? 'text-white' : 'text-white/40'}`}>{item.label}</h4>
                    <p className={`text-xs transition-colors duration-300 ${step >= item.stepNum ? 'text-white/60' : 'text-white/30'}`}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — signup wizard */}
      <div className="flex-1 flex items-center justify-center p-8 relative overflow-y-auto">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/[0.03] blur-3xl" />

        <div className="w-full max-w-md relative z-10 my-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <FileCheck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">CertGen</h1>
          </div>

          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full">
              Step {step} of 3
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-3 mb-2 tracking-tight">
              {step === 1 && 'Create admin account'}
              {step === 2 && 'Set up your company'}
              {step === 3 && 'Upload brand assets'}
            </h2>
            <p className="text-slate-500 text-sm">
              {step === 1 && 'Set up your master administrator credentials'}
              {step === 2 && 'Enter company details for certificate footers'}
              {step === 3 && 'Upload seal logo and signatories to embed in templates'}
            </p>
          </div>

          {error && (
            <div className="p-3.5 mb-5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* STEP 1: ADMIN ACCOUNT */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label className="text-slate-400 font-medium">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <Input
                      type="text"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="bg-white/[0.03] border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 h-12 rounded-xl pl-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-400 font-medium">Admin Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <Input
                      type="email"
                      placeholder="admin@mycompany.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-white/[0.03] border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 h-12 rounded-xl pl-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-400 font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-white/[0.03] border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 h-12 rounded-xl pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-400 font-medium">Confirm Password</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-white/[0.03] border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 h-12 rounded-xl"
                  />
                </div>

                <Button
                  type="button"
                  onClick={nextStep}
                  className="w-full h-12 text-base bg-gradient-to-r from-violet-600 to-indigo-600 border-0 shadow-lg shadow-indigo-500/20 rounded-xl font-semibold mt-4"
                >
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* STEP 2: COMPANY METADATA */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label className="text-slate-400 font-medium">Company / Organization Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <Input
                      type="text"
                      placeholder="Acme Corporation"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      className="bg-white/[0.03] border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 h-12 rounded-xl pl-11"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-400 font-medium">Certificate Prefix</Label>
                    <Input
                      type="text"
                      placeholder="ACME"
                      value={certificatePrefix}
                      onChange={(e) => setCertificatePrefix(e.target.value.toUpperCase())}
                      maxLength={6}
                      required
                      className="bg-white/[0.03] border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-400 font-medium">Director / Signatory</Label>
                    <Input
                      type="text"
                      placeholder="John Smith"
                      value={directorName}
                      onChange={(e) => setDirectorName(e.target.value)}
                      className="bg-white/[0.03] border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 h-12 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-400 font-medium">Company Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-12 w-4 h-4 text-slate-600" style={{ transform: 'translateY(-50%)' }} />
                    <Input
                      type="text"
                      placeholder="123 Corporate Blvd, New York, NY"
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      className="bg-white/[0.03] border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 h-12 rounded-xl pl-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-400 font-medium">Company Website (Optional)</Label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <Input
                      type="url"
                      placeholder="https://acme.com"
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      className="bg-white/[0.03] border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 h-12 rounded-xl pl-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-400 font-medium">Company Email (Optional)</Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <Input
                      type="email"
                      placeholder="info@acme.com"
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      className="bg-white/[0.03] border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 h-12 rounded-xl pl-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-400 font-medium">Company Phone Number (Optional)</Label>
                  <PhoneInput
                    value={companyPhone}
                    onChange={(val) => setCompanyPhone(val)}
                    placeholder="0000 000 000"
                  />
                </div>

                <div className="flex gap-4 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="flex-1 h-12 border-white/10 text-slate-300 bg-white/5 hover:bg-white/10 rounded-xl"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 h-12 bg-gradient-to-r from-violet-600 to-indigo-600 border-0 shadow-lg shadow-indigo-500/20 rounded-xl font-semibold"
                  >
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: BRAND ASSETS */}
            {step === 3 && (
              <div className="space-y-5 animate-fade-in">
                {/* Logo Upload */}
                <div className="space-y-2">
                  <Label className="text-slate-400 font-medium flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-indigo-400" /> Company Seal Logo
                  </Label>
                  <div 
                    onClick={() => logoInputRef.current?.click()}
                    className="border border-white/10 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] p-5 text-center cursor-pointer transition-all duration-300 group flex flex-col items-center justify-center min-h-[140px]"
                  >
                    {logoData ? (
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-[#070714] p-2 flex items-center justify-center">
                        <img src={logoData} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-slate-500 mb-2 group-hover:text-indigo-400 transition-colors" />
                        <span className="text-xs text-slate-400 font-medium">Click to upload seal logo</span>
                        <span className="text-[10px] text-slate-600 mt-1">PNG, JPG or WebP (max 5MB)</span>
                      </>
                    )}
                    <input 
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoFileChange}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Signature Upload */}
                <div className="space-y-2">
                  <Label className="text-slate-400 font-medium flex items-center gap-1.5">
                    <Pen className="w-4 h-4 text-indigo-400" /> Authorized Signature
                  </Label>
                  <div 
                    onClick={() => signatureInputRef.current?.click()}
                    className="border border-white/10 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] p-5 text-center cursor-pointer transition-all duration-300 group flex flex-col items-center justify-center min-h-[140px]"
                  >
                    {signatureData ? (
                      <div className="relative w-36 h-20 rounded-xl overflow-hidden bg-[#070714] p-2 flex items-center justify-center">
                        <img src={signatureData} alt="Signature Preview" className="max-w-full max-h-full object-contain" />
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-slate-500 mb-2 group-hover:text-indigo-400 transition-colors" />
                        <span className="text-xs text-slate-400 font-medium">Click to upload signature</span>
                        <span className="text-[10px] text-slate-600 mt-1">PNG, JPG or WebP (max 5MB)</span>
                      </>
                    )}
                    <input 
                      ref={signatureInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleSignatureFileChange}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={isLoading}
                    className="flex-1 h-12 border-white/10 text-slate-300 bg-white/5 hover:bg-white/10 rounded-xl"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    className="flex-1 h-12 bg-gradient-to-r from-violet-600 to-indigo-600 border-0 shadow-lg shadow-indigo-500/20 rounded-xl font-semibold text-white flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Complete Sign Up
                  </Button>
                </div>
              </div>
            )}

            <div className="text-center mt-6">
              <p className="text-sm text-slate-500">
                Already have an account?{' '}
                <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold underline transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
