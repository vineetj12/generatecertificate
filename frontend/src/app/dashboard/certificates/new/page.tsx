'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { RichTextEditor } from '@/components/rich-text-editor';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Download,
  Eye,
  Sparkles,
  CheckCircle,
  RefreshCw,
  Award,
  Upload,
  FileCheck,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  studentName: z.string().min(1, 'Student name is required'),
  collegeName: z.string().optional(),
  course: z.string().optional(),
  internshipRole: z.string().min(1, 'Internship role is required'),
  projectName: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  templateType: z.string(),
  internPhone: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

// Certificate is A4 landscape: 1123 × 794 px
const CERT_W = 1123;
const CERT_H = 794;

function PreviewIframe({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  const computeScale = useCallback(() => {
    if (containerRef.current) {
      const available = containerRef.current.clientWidth;
      setScale(available / CERT_W);
    }
  }, []);

  useEffect(() => {
    computeScale();
    const ro = new ResizeObserver(computeScale);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [computeScale]);

  const scaledHeight = Math.ceil(CERT_H * scale);

  return (
    <div ref={containerRef} className="w-full relative overflow-hidden rounded-xl bg-white dark:bg-[#070714] shadow-2xl border border-white/5">
      <div style={{ width: '100%', height: scaledHeight, position: 'relative', overflow: 'hidden' }}>
        <iframe
          srcDoc={html}
          title="Certificate Preview"
          scrolling="no"
          style={{
            width: CERT_W,
            height: CERT_H,
            border: 'none',
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
}

export default function NewCertificatePage() {
  const [description, setDescription] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [success, setSuccess] = useState<{ id: string; certificateId: string } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { templateType: 'andro' },
  });

  const watchedValues = watch();

  const handlePreview = useCallback(async () => {
    if (!watchedValues.studentName || !watchedValues.internshipRole) {
      alert('Please fill in at least Student Name and Internship Role before previewing.');
      return;
    }
    setIsPreviewing(true);
    try {
      const startDate = watchedValues.startDate
        ? new Date(watchedValues.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : 'Start Date';
      const endDate = watchedValues.endDate
        ? new Date(watchedValues.endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : 'End Date';

      const response = await api.certificates.preview({
        ...watchedValues,
        description: description || '<p>Certificate description will appear here.</p>',
        startDate,
        endDate,
      });
      setPreviewHtml(response.data.html);
    } catch (error) {
      console.error('Preview failed:', error);
      alert('Preview failed. Make sure the backend is running.');
    } finally {
      setIsPreviewing(false);
    }
  }, [watchedValues, description]);

  // Load initial preview dummy if name/role is populated
  useEffect(() => {
    if (watchedValues.studentName && watchedValues.internshipRole && !previewHtml && !loadingPreview.current) {
      loadingPreview.current = true;
      handlePreview().finally(() => {
        loadingPreview.current = false;
      });
    }
  }, [watchedValues.studentName, watchedValues.internshipRole, handlePreview, previewHtml]);

  const loadingPreview = useRef(false);

  const onSubmit = async (data: FormData) => {
    if (!description) {
      alert('Please enter a certificate description');
      return;
    }
    setIsGenerating(true);
    try {
      const response = await api.certificates.create({
        ...data,
        description,
      });
      setSuccess({ id: response.data.id, certificateId: response.data.certificateId });
    } catch (error: any) {
      alert(error.message || 'Failed to generate certificate');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!success) return;
    try {
      const blob = await api.certificates.download(success.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Certificate-${success.certificateId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try from the Certificates list.');
    }
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto mt-16 text-center animate-fade-in bg-white/5 dark:bg-[#0d0d21]/30 backdrop-blur-md border border-slate-200/10 dark:border-white/5 p-8 rounded-2xl">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/25">
          <CheckCircle className="w-10 h-10 text-emerald-400" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
          Certificate Generated!
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-1 text-sm">
          Your certificate has been created successfully.
        </p>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
          Certificate ID:{' '}
          <span className="font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 border border-indigo-500/20 rounded-lg">{success.certificateId}</span>
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" onClick={handleDownload} className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 border-0 h-12 shadow-lg shadow-indigo-500/20 rounded-xl">
            <Download className="w-4 h-4 mr-2" /> Download PDF
          </Button>
          <Button size="lg" variant="outline" onClick={() => { setSuccess(null); setPreviewHtml(''); }} className="w-full sm:w-auto rounded-xl border-white/10 text-white h-12 bg-white/5 hover:bg-white/10">
            Generate Another
          </Button>
          <Link href="/dashboard/certificates" className="w-full sm:w-auto">
            <Button size="lg" variant="ghost" className="w-full h-12 rounded-xl text-slate-400 hover:text-white">View All</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-white/5 border border-white/5 text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text">Generate Certificate</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Fill in student details to generate a verified internship completion certificate.
          </p>
        </div>
      </div>

      {/* Main Workspace: Side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-slate-200/10 dark:border-white/5 bg-white/5 dark:bg-[#0d0d21]/30 backdrop-blur-md p-6 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Form Section 1: Student Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-white/5 pb-2">Student & College Info</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Student Name *</Label>
                    <Input {...register('studentName')} placeholder="e.g. Rahul Sharma" className="glass-input h-11 focus-visible:ring-0 text-white rounded-xl placeholder-slate-600 border-white/5" />
                    {errors.studentName && (
                      <p className="text-xs text-rose-400 font-semibold">{errors.studentName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Course / Degree</Label>
                    <Input {...register('course')} placeholder="e.g. B.Tech – Computer Science" className="glass-input h-11 focus-visible:ring-0 text-white rounded-xl placeholder-slate-600 border-white/5" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">College / University</Label>
                    <Input {...register('collegeName')} placeholder="e.g. JC Bose University" className="glass-input h-11 focus-visible:ring-0 text-white rounded-xl placeholder-slate-600 border-white/5" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Intern Phone Number</Label>
                    <Input {...register('internPhone')} placeholder="e.g. +91 98765 43210" className="glass-input h-11 focus-visible:ring-0 text-white rounded-xl placeholder-slate-600 border-white/5" />
                  </div>
                </div>
              </div>

              {/* Form Section 2: Internship Details */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-white/5 pb-2">Internship Role & Project</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Internship Role *</Label>
                    <Input {...register('internshipRole')} placeholder="e.g. Full Stack Developer" className="glass-input h-11 focus-visible:ring-0 text-white rounded-xl placeholder-slate-600 border-white/5" />
                    {errors.internshipRole && (
                      <p className="text-xs text-rose-400 font-semibold">{errors.internshipRole.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Project Name</Label>
                    <Input {...register('projectName')} placeholder="e.g. E-Commerce Platform" className="glass-input h-11 focus-visible:ring-0 text-white rounded-xl placeholder-slate-600 border-white/5" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Start Date *</Label>
                    <Input type="date" {...register('startDate')} className="glass-input h-11 focus-visible:ring-0 text-white rounded-xl dark:[color-scheme:dark] border-white/5" />
                    {errors.startDate && (
                      <p className="text-xs text-rose-400 font-semibold">{errors.startDate.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">End Date *</Label>
                    <Input type="date" {...register('endDate')} className="glass-input h-11 focus-visible:ring-0 text-white rounded-xl dark:[color-scheme:dark] border-white/5" />
                    {errors.endDate && (
                      <p className="text-xs text-rose-400 font-semibold">{errors.endDate.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Section 3: Design & Styling */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-white/5 pb-2">Branding & Template</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Design Template</Label>
                    <Select
                      {...register('templateType')}
                      className="bg-[#0f0f26]/50 border-white/5 text-white h-11 rounded-xl focus:ring-1 focus:ring-indigo-500"
                      options={[
                        { value: 'andro', label: '🛡️ AndroWebTech' },
                        { value: 'classic', label: '🏛️ Classic Formal' },
                        { value: 'modern', label: '🎨 Modern Tech' },
                        { value: 'elegant', label: '✨ Elegant Gold' },
                      ]}
                    />
                  </div>
                </div>
              </div>

              {/* Form Section 4: Editor */}
              <div className="space-y-2 pt-4 border-t border-white/5">
                <Label className="text-slate-300">Certificate Description *</Label>
                <div className="rounded-xl overflow-hidden border border-white/5 bg-[#0a0a19]/40">
                  <RichTextEditor
                    value={description}
                    onChange={setDescription}
                    placeholder="This certificate is proudly awarded to [Student Name] for successfully completing a [Role] internship from [Start] to [End]. During this period, he/she demonstrated exceptional skills..."
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Supports bold, italic, underline, and lists. Use keywords matching student profile.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-white/5">
                <Button type="submit" isLoading={isGenerating} className="flex-1 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 border-0 h-12 shadow-lg shadow-indigo-500/20 rounded-xl font-semibold">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Certificate
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handlePreview}
                  isLoading={isPreviewing}
                  className="sm:w-auto h-12 border-white/10 text-white rounded-xl bg-white/5 hover:bg-white/10"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Update Preview
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Live Sticky Preview (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Live Viewport</h3>
            <Badge variant="secondary" className="bg-white/5 border border-white/5 text-slate-300 font-mono text-[10px] uppercase">A4 Scale Ratio</Badge>
          </div>

          <div className="rounded-2xl border border-slate-200/10 dark:border-white/5 bg-white/5 dark:bg-[#0d0d21]/30 backdrop-blur-md p-4 flex flex-col justify-center min-h-[350px]">
            {previewHtml ? (
              <div className="space-y-4">
                <div className="max-w-full overflow-hidden rounded-xl shadow-2xl">
                  <PreviewIframe html={previewHtml} />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <p className="text-[10px] text-slate-500 font-medium">
                    Auto-fits canvas width. PDF fonts match printer layout.
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    isLoading={isPreviewing}
                    onClick={handlePreview}
                    className="text-slate-400 hover:text-white hover:bg-white/5 rounded-lg text-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 opacity-60">
                  <Award className="w-8 h-8" />
                </div>
                <div className="max-w-xs mx-auto">
                  <p className="text-sm font-semibold text-slate-300">No Preview Rendered</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Fill in the Name and Internship Role, then click <span className="font-semibold text-indigo-400">Update Preview</span> to render.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={handlePreview}
                  isLoading={isPreviewing}
                  className="bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs h-9 px-4"
                >
                  <Eye className="w-3.5 h-3.5 mr-1.5" /> Initialize Preview
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
