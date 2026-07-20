import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  className?: string;
  iconClassName?: string;
}

export function StatsCard({ title, value, description, icon: Icon, trend, className, iconClassName }: StatsCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-white/5 dark:bg-[#0d0d21]/30 backdrop-blur-md border border-slate-200/10 dark:border-white/5 p-6 transition-all duration-300 hover:shadow-xl hover:border-indigo-500/30 dark:hover:border-indigo-500/25 hover:shadow-indigo-500/5 group scale-100 hover:scale-[1.02]",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{title}</p>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white bg-gradient-to-br from-white via-slate-100 to-slate-300 bg-clip-text">
            {value}
          </p>
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400/70 font-medium">{description}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "text-xs font-bold",
                  trend.value >= 0 ? "text-emerald-400" : "text-rose-400"
                )}
              >
                {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-slate-500">{trend.label}</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "p-3.5 rounded-xl transition-all duration-300 group-hover:scale-110 shadow-lg",
            iconClassName || "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}
