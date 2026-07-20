'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Certificate } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import {
  Search,
  Download,
  Trash2,

  PlusCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Filter,
  Eye,
  Upload,
  FileSpreadsheet,
  X,
  AlertCircle,
} from 'lucide-react';

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0, limit: 10 });
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Bulk upload state
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResult, setBulkResult] = useState<any>(null);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadCertificates = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.certificates.list({
        page,
        limit: 10,
        search,
        dateFrom,
        dateTo,
      });
      setCertificates(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to load certificates:', error);
    } finally {
      setLoading(false);
    }
  }, [page, search, dateFrom, dateTo]);

  useEffect(() => {
    loadCertificates();
  }, [loadCertificates]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadCertificates();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDownload = async (cert: Certificate) => {
    setActionLoading(cert.id);
    try {
      const blob = await api.certificates.download(cert.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Certificate-${cert.certificateId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (cert: Certificate) => {
    if (!confirm(`Are you sure you want to revoke certificate ${cert.certificateId}?`)) return;
    setActionLoading(cert.id);
    try {
      await api.certificates.delete(cert.id);
      loadCertificates();
    } catch (error: any) {
      alert(error.message || 'Delete failed');
    } finally {
      setActionLoading(null);
    }
  };



  const handleBulkOpen = () => {
    setBulkFile(null);
    setBulkResult(null);
    setBulkError(null);
    setShowBulkModal(true);
  };

  const handleBulkClose = () => {
    setShowBulkModal(false);
    setBulkFile(null);
    setBulkResult(null);
    setBulkError(null);
  };

  const handleBulkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBulkFile(file);
      setBulkError(null);
      setBulkResult(null);
    }
  };

  const handleBulkSubmit = async () => {
    if (!bulkFile) return;
    setBulkLoading(true);
    setBulkError(null);
    try {
      const response = await api.certificates.bulkGenerate(bulkFile);
      setBulkResult(response.data);
      loadCertificates();
    } catch (error: any) {
      setBulkError(error.message || 'Bulk generation failed');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const blob = await api.certificates.downloadTemplate();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'certificate-template.xlsx';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to download template');
    }
  };

  return (
    <>
    {/* Bulk Upload Modal */}
    {showBulkModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleBulkClose} />
        <div className="relative w-full max-w-lg bg-[#0d0d21] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg">
                <FileSpreadsheet className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Bulk Generate</h2>
                <p className="text-xs text-slate-400">Upload an Excel file to generate multiple certificates</p>
              </div>
            </div>
            <button onClick={handleBulkClose} className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-5">
            {!bulkResult ? (
              <>
                {/* Step 1: Download Template */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">1</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">Download Template</p>
                    <p className="text-xs text-slate-400 mt-0.5">Get the Excel template with required columns</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadTemplate}
                    className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 rounded-xl text-xs px-3"
                  >
                    <Download className="w-3.5 h-3.5 mr-1.5" /> Template
                  </Button>
                </div>

                {/* Step 2: Upload File */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">2</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">Upload Excel File</p>
                      <p className="text-xs text-slate-400 mt-0.5">Supports .xlsx and .xls formats</p>
                    </div>
                  </div>
                  <div
                    className={`mt-2 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                      bulkFile
                        ? 'border-indigo-500/50 bg-indigo-500/5'
                        : 'border-white/10 hover:border-indigo-500/30 hover:bg-white/5'
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleBulkFileChange}
                      className="hidden"
                    />
                    {bulkFile ? (
                      <div className="flex items-center justify-center gap-3">
                        <FileSpreadsheet className="w-8 h-8 text-indigo-400" />
                        <div className="text-left">
                          <p className="text-sm font-semibold text-white">{bulkFile.name}</p>
                          <p className="text-xs text-slate-400">{(bulkFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); setBulkFile(null); }}
                          className="ml-2 text-slate-400 hover:text-rose-400 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                        <p className="text-sm text-slate-400">Click to select or drag & drop your file</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Error Display */}
                {bulkError && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                    <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-rose-300">{bulkError}</p>
                  </div>
                )}
              </>
            ) : (
              /* Results Summary */
              <div className="space-y-4">
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                    <p className="text-2xl font-bold text-white">{bulkResult.total}</p>
                    <p className="text-xs text-slate-400 mt-1">Total Rows</p>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                    <p className="text-2xl font-bold text-emerald-400">{bulkResult.successful}</p>
                    <p className="text-xs text-emerald-400/70 mt-1">Successful</p>
                  </div>
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
                    <p className="text-2xl font-bold text-rose-400">{bulkResult.failed}</p>
                    <p className="text-xs text-rose-400/70 mt-1">Failed</p>
                  </div>
                </div>

                {/* Row-by-row results */}
                <div className="max-h-60 overflow-y-auto rounded-xl border border-white/5 divide-y divide-white/5">
                  {bulkResult.results.map((r: any, i: number) => (
                    <div key={i} className={`flex items-center justify-between px-4 py-3 text-sm ${
                      r.status === 'success' ? 'bg-white/[0.02]' : 'bg-rose-500/5'
                    }`}>
                      <div className="flex items-center gap-2 min-w-0">
                        {r.status === 'success' ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                        )}
                        <span className="text-slate-300 truncate">Row {r.row}: {r.studentName}</span>
                      </div>
                      {r.status === 'success' ? (
                        <code className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md flex-shrink-0 ml-2">{r.certificateId}</code>
                      ) : (
                        <span className="text-xs text-rose-400 flex-shrink-0 ml-2 max-w-[150px] truncate" title={r.error}>{r.error}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-white/5">
            {!bulkResult ? (
              <>
                <Button variant="outline" onClick={handleBulkClose} className="border-white/10 text-slate-300 hover:bg-white/5 rounded-xl">
                  Cancel
                </Button>
                <Button
                  onClick={handleBulkSubmit}
                  disabled={!bulkFile || bulkLoading}
                  isLoading={bulkLoading}
                  className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 border-0 shadow-lg shadow-indigo-500/20 rounded-xl px-5"
                >
                  <Upload className="w-4 h-4 mr-2" /> Generate Certificates
                </Button>
              </>
            ) : (
              <Button onClick={handleBulkClose} className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 border-0 shadow-lg shadow-indigo-500/20 rounded-xl px-5">
                Done
              </Button>
            )}
          </div>
        </div>
      </div>
    )}

    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text">Certificates</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage and revoke all generated credentials ({pagination.total} total)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleBulkOpen}
            variant="outline"
            className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 active:scale-95 transition-all rounded-xl h-11 px-5"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" /> Bulk Generate
          </Button>
          <Link href="/dashboard/certificates/new">
            <Button className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all rounded-xl h-11 px-5">
              <PlusCircle className="w-4 h-4 mr-2" /> Generate New
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200/10 dark:border-white/5 bg-white/5 dark:bg-[#0d0d21]/30 backdrop-blur-md p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search by student name, certificate ID, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 bg-white/5 dark:bg-white/5 border-slate-200/10 dark:border-white/5 focus-visible:ring-indigo-500 text-white placeholder-slate-500 rounded-xl"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-white/5 dark:bg-white/5 border border-slate-200/10 dark:border-white/5 rounded-xl px-3 h-11 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                className="bg-transparent border-0 h-full p-0 focus-visible:ring-0 text-white dark:[color-scheme:dark] placeholder-slate-500 text-xs w-28"
              />
              <span className="text-slate-500 text-xs px-1">to</span>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
                className="bg-transparent border-0 h-full p-0 focus-visible:ring-0 text-white dark:[color-scheme:dark] placeholder-slate-500 text-xs w-28"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200/10 dark:border-white/5 bg-white/5 dark:bg-[#0d0d21]/30 backdrop-blur-md overflow-hidden">
        {loading ? (
          <div className="py-24 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto" />
          </div>
        ) : certificates.length === 0 ? (
          <div className="py-24 text-center">
            <XCircle className="w-12 h-12 text-slate-500 mx-auto opacity-40 mb-3" />
            <p className="text-slate-400 font-medium">No certificates match your query</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200/10 dark:border-white/5 bg-white/5">
                  <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-6 py-4">Student</th>
                  <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-4 py-4">Certificate ID</th>
                  <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-4 py-4 hidden lg:table-cell">Role</th>
                  <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-4 py-4 hidden md:table-cell">Date</th>
                  <th className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider px-4 py-4">Status</th>
                  <th className="text-right text-xs font-bold text-slate-400 uppercase tracking-wider px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/10 dark:divide-white/5">
                {certificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-white/5 transition-all duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md">
                          {cert.studentName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-200 truncate">{cert.studentName}</p>
                          <p className="text-xs text-slate-500 truncate mt-0.5">{cert.collegeName || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <code className="text-xs font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg">
                        {cert.certificateId}
                      </code>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{cert.internshipRole}</span>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{formatDate(cert.createdAt)}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Badge variant={cert.status === 'valid' ? 'success' : 'destructive'} className="rounded-lg px-2.5 py-1">
                        {cert.status === 'valid' ? (
                          <><CheckCircle className="w-3 h-3 mr-1.5" /> Valid</>
                        ) : (
                          <><XCircle className="w-3 h-3 mr-1.5" /> Revoked</>
                        )}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/verify/${cert.certificateId}`} target="_blank">
                          <Button variant="ghost" size="icon" title="Verify Link" className="text-slate-400 hover:text-white hover:bg-white/5 rounded-lg w-9 h-9">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Download PDF"
                          onClick={() => handleDownload(cert)}
                          disabled={actionLoading === cert.id}
                          className="text-slate-400 hover:text-white hover:bg-white/5 rounded-lg w-9 h-9"
                        >
                          <Download className="w-4 h-4" />
                        </Button>

                        {cert.status === 'valid' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Revoke Certificate"
                            onClick={() => handleDelete(cert)}
                            disabled={actionLoading === cert.id}
                            className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg w-9 h-9 border-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200/10 dark:border-white/5 bg-white/5">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Page {page} of {pagination.totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 rounded-xl"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(page + 1)}
                className="bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 rounded-xl"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
