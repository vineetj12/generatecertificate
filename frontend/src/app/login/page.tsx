'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileCheck, Eye, EyeOff, Sparkles, ShieldCheck, FileSpreadsheet } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
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
            Professional<br />
            Certificate<br />
            Generation
          </h2>
          <p className="text-lg text-white/60 max-w-md leading-relaxed">
            Generate, manage, and verify professional internship certificates with ease. 
            Beautiful templates, QR verification, and bulk generation.
          </p>

          <div className="mt-14 grid grid-cols-3 gap-4">
            {[
              { label: 'Templates', value: '3+', icon: Sparkles },
              { label: 'QR Verify', value: '✓', icon: ShieldCheck },
              { label: 'Bulk Upload', value: '✓', icon: FileSpreadsheet },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-white/[0.06] backdrop-blur-sm border border-white/10 p-4 text-center group hover:border-white/20 transition-all duration-300">
                <item.icon className="w-5 h-5 text-white/40 mx-auto mb-2 group-hover:text-white/60 transition-colors" />
                <p className="text-xl font-extrabold text-white">{item.value}</p>
                <p className="text-[11px] text-white/40 mt-0.5 font-medium uppercase tracking-wider">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Background glow for right panel */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/[0.03] blur-3xl" />

        <div className="w-full max-w-md relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <FileCheck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">CertGen</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Welcome back</h2>
            <p className="text-slate-500">Sign in to your admin account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in font-medium">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-slate-400 font-medium">Email</Label>
              <Input
                type="email"
                placeholder="admin@certgen.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/[0.03] border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 h-12 rounded-xl"
              />
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

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full h-12 text-base bg-gradient-to-r from-violet-600 to-indigo-600 border-0 shadow-lg shadow-indigo-500/20 rounded-xl font-semibold"
            >
              Sign In
            </Button>

            <div className="text-center text-sm text-slate-400 mt-2">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold underline transition-colors">
                Sign Up
              </Link>
            </div>

            <div className="text-center mt-4">
              <p className="text-xs text-slate-600">
                Default: <code className="text-indigo-400/60 font-mono">admin@certgen.com / admin123</code>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
