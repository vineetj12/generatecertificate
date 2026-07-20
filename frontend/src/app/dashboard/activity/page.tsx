'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { ActivityLog } from '@/types';
import { Button } from '@/components/ui/button';
import { formatRelativeTime, getActionIcon, getActionLabel } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Activity } from 'lucide-react';

export default function ActivityPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });

  useEffect(() => {
    loadLogs();
  }, [page]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const response = await api.activity.list({ page, limit: 20 });
      setLogs(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to load logs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text">Activity Logs</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Audit trail of all actions and changes&nbsp;·&nbsp;
          <span className="text-indigo-400 font-mono font-semibold">{pagination.total}</span> total events
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/10 dark:border-white/5 bg-white/5 dark:bg-[#0d0d21]/30 backdrop-blur-md overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <div className="animate-spin rounded-full h-9 w-9 border-2 border-indigo-500 border-t-transparent mx-auto" />
            <p className="text-sm text-slate-500 mt-4 font-medium">Loading events…</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-20 text-center">
            <Activity className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3 opacity-40" />
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">No activity recorded yet</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {logs.map((log, i) => (
              <div
                key={log.id}
                className="flex items-start gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors duration-200 group"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-lg flex-shrink-0 group-hover:border-indigo-500/40 transition-colors">
                  {getActionIcon(log.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {getActionLabel(log.action)}
                  </p>
                  {log.details && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      {log.details}
                    </p>
                  )}
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-600 flex-shrink-0 mt-0.5 font-mono">
                  {formatRelativeTime(log.createdAt)}
                </span>
              </div>
            ))}
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3.5 border-t border-white/5">
            <p className="text-sm text-slate-500 font-medium">
              Page <span className="text-slate-300 font-mono">{page}</span> of <span className="text-slate-300 font-mono">{pagination.totalPages}</span>
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-slate-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(page + 1)}
                className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-slate-300"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
