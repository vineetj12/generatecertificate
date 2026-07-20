'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Statistics } from '@/types';
import { StatsCard } from '@/components/stats-card';
import { Badge } from '@/components/ui/badge';
import {
  Award,
  CalendarCheck,
  CheckCircle,
  XCircle,
  BarChart3,
  TrendingUp,
  PieChart,
} from 'lucide-react';

export default function AnalyticsPage() {
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
      <div className="animate-pulse space-y-8">
        <div className="h-10 w-64 bg-slate-200 dark:bg-white/5 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-slate-200 dark:bg-white/5 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-slate-200 dark:bg-white/5 rounded-2xl" />
          <div className="h-96 bg-slate-200 dark:bg-white/5 rounded-2xl" />
        </div>
      </div>
    );
  }

  const total = stats?.total || 0;
  const validPercent = total > 0 ? Math.round(((stats?.validCount || 0) / total) * 100) : 0;

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text">Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Certificate generation metrics, template usage, and verification trends
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Generated" value={total} icon={Award}
          iconClassName="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" />
        <StatsCard title="This Month" value={stats?.monthCount || 0} icon={CalendarCheck}
          iconClassName="bg-purple-500/10 text-purple-400 border border-purple-500/20" />
        <StatsCard title="Valid Records" value={stats?.validCount || 0} icon={CheckCircle}
          description={`${validPercent}% verified active`}
          iconClassName="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" />
        <StatsCard title="Revoked Records" value={stats?.revokedCount || 0} icon={XCircle}
          iconClassName="bg-rose-500/10 text-rose-400 border border-rose-500/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly trend chart */}
        <div className="rounded-2xl border border-slate-200/10 dark:border-white/5 bg-white/5 dark:bg-[#0d0d21]/30 backdrop-blur-md p-6">
          <div className="flex items-center gap-2.5 mb-6">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-slate-900 dark:text-white">Monthly Generation Trend</h3>
          </div>

          <div className="space-y-4">
            {stats?.monthlyTrend?.map((item) => {
              const maxCount = Math.max(...(stats.monthlyTrend?.map(t => t.count) || [1]), 1);
              const percentage = (item.count / maxCount) * 100;
              return (
                <div key={item.month}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{item.month}</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">{item.count}</span>
                  </div>
                  <div className="w-full bg-white/5 dark:bg-white/5 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${Math.max(percentage, 3)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Role distribution */}
        <div className="rounded-2xl border border-slate-200/10 dark:border-white/5 bg-white/5 dark:bg-[#0d0d21]/30 backdrop-blur-md p-6">
          <div className="flex items-center gap-2.5 mb-6">
            <PieChart className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-slate-900 dark:text-white">Role Distribution</h3>
          </div>

          {stats?.roleDistribution?.length ? (
            <div className="space-y-4">
              {stats.roleDistribution.map((item, i) => {
                const colors = [
                  'from-indigo-500 to-blue-500',
                  'from-purple-500 to-pink-500',
                  'from-emerald-500 to-teal-500',
                  'from-amber-500 to-orange-500',
                  'from-rose-500 to-red-500',
                ];
                const bgColors = [
                  'bg-indigo-400',
                  'bg-purple-400',
                  'bg-emerald-400',
                  'bg-amber-400',
                  'bg-rose-400',
                ];
                const maxRole = Math.max(...stats.roleDistribution.map(r => r.count), 1);
                const pct = (item.count / maxRole) * 100;

                return (
                  <div key={item.role}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${bgColors[i % 5]}`} />
                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-300 truncate">{item.role}</span>
                      </div>
                      <Badge variant="secondary" className="bg-white/5 border border-white/5 text-slate-300 font-mono rounded-md">{item.count}</Badge>
                    </div>
                    <div className="w-full bg-white/5 dark:bg-white/5 rounded-full h-2.5 overflow-hidden ml-5">
                      <div
                        className={`h-full bg-gradient-to-r ${colors[i % 5]} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${Math.max(pct, 3)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <BarChart3 className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3 opacity-40" />
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Generate certificates to see role distribution</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary metrics */}
      <div className="rounded-2xl border border-slate-200/10 dark:border-white/5 bg-white/5 dark:bg-[#0d0d21]/30 backdrop-blur-md p-6 sm:p-8">
        <h3 className="font-bold text-slate-900 dark:text-white mb-6">Quick Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-3xl font-extrabold text-indigo-400 font-mono">{stats?.todayCount || 0}</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Today</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-purple-400 font-mono">{stats?.monthCount || 0}</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">This Month</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-emerald-400 font-mono">{validPercent}%</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Valid Rate</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-amber-400 font-mono">{stats?.roleDistribution?.length || 0}</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Unique Roles</p>
          </div>
        </div>
      </div>
    </div>
  );
}
