'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Statistics, Certificate } from '@/types';
import { StatsCard } from '@/components/stats-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import {
  Award,
  CalendarCheck,
  CalendarDays,
  CheckCircle,
  XCircle,
  PlusCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.certificates.stats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-64 bg-slate-200 dark:bg-white/5 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-white/5 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-slate-200 dark:bg-white/5 rounded-2xl" />
          <div className="h-96 bg-slate-200 dark:bg-white/5 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text">
            System Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Welcome back! Here&apos;s an overview of your generated certificates.
          </p>
        </div>
        <Link href="/dashboard/certificates/new">
          <Button className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all rounded-xl h-11 px-5">
            <PlusCircle className="w-4 h-4 mr-2" />
            Generate Certificate
          </Button>
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Certificates"
          value={stats?.total || 0}
          icon={Award}
          iconClassName="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
        />
        <StatsCard
          title="Generated Today"
          value={stats?.todayCount || 0}
          icon={CalendarCheck}
          iconClassName="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
        />
        <StatsCard
          title="This Month"
          value={stats?.monthCount || 0}
          icon={CalendarDays}
          iconClassName="bg-purple-500/10 text-purple-400 border border-purple-500/20"
        />
        <StatsCard
          title="Valid Certificates"
          value={stats?.validCount || 0}
          description={`${stats?.revokedCount || 0} revoked`}
          icon={CheckCircle}
          iconClassName="bg-amber-500/10 text-amber-400 border border-amber-500/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent certificates */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/10 dark:border-white/5 bg-white/5 dark:bg-[#0d0d21]/30 backdrop-blur-md overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/10 dark:border-white/5">
            <h2 className="font-bold text-slate-900 dark:text-white">Recent Certificates</h2>
            <Link href="/dashboard/certificates">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-white/5 rounded-lg">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-slate-200/10 dark:divide-white/5">
            {stats?.recentCertificates?.length ? (
              stats.recentCertificates.map((cert: Certificate) => (
                <div key={cert.id} className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-all duration-200">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-md">
                      {cert.studentName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-200 truncate">
                        {cert.studentName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {cert.internshipRole} • <span className="font-mono text-indigo-400">{cert.certificateId}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                    <Badge variant={cert.status === 'valid' ? 'success' : 'destructive'} className="rounded-lg px-2.5 py-1">
                      {cert.status === 'valid' ? (
                        <><CheckCircle className="w-3 h-3 mr-1.5" /> Valid</>
                      ) : (
                        <><XCircle className="w-3 h-3 mr-1.5" /> Revoked</>
                      )}
                    </Badge>
                    <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline font-medium">
                      {formatRelativeTime(cert.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-16 text-center">
                <Award className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-4 opacity-50" />
                <p className="text-sm text-slate-500 dark:text-slate-400">No certificates generated yet</p>
                <Link href="/dashboard/certificates/new" className="inline-block mt-4">
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 rounded-lg">Generate your first</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Monthly trend & Role distribution */}
        <div className="space-y-8">
          {/* Monthly Trend */}
          <div className="rounded-2xl border border-slate-200/10 dark:border-white/5 bg-white/5 dark:bg-[#0d0d21]/30 backdrop-blur-md p-6">
            <div className="flex items-center gap-2.5 mb-6">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Monthly Trend</h3>
            </div>
            <div className="space-y-4">
              {stats?.monthlyTrend?.map((item) => {
                const maxCount = Math.max(...(stats.monthlyTrend?.map(t => t.count) || [1]));
                const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                return (
                  <div key={item.month} className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 w-20 flex-shrink-0">
                      {item.month}
                    </span>
                    <div className="flex-1 bg-white/5 dark:bg-white/5 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.max(percentage, 2)}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 w-6 text-right font-mono">
                      {item.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Role Distribution */}
          <div className="rounded-2xl border border-slate-200/10 dark:border-white/5 bg-white/5 dark:bg-[#0d0d21]/30 backdrop-blur-md p-6">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-6">Top Roles</h3>
            <div className="space-y-3.5">
              {stats?.roleDistribution?.length ? (
                stats.roleDistribution.slice(0, 5).map((item, i) => (
                  <div key={item.role} className="flex items-center justify-between py-1 border-b border-white/5 last:border-0 pb-2 last:pb-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                        ['bg-indigo-400','bg-purple-400','bg-pink-400','bg-amber-400','bg-emerald-400'][i % 5]
                      }`} />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                        {item.role}
                      </span>
                    </div>
                    <Badge variant="secondary" className="bg-white/5 border border-white/5 text-slate-300 rounded-md font-mono">{item.count}</Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-6">No data yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
