'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

import {
  LayoutDashboard,
  Award,
  PlusCircle,
  Settings,
  Activity,
  BarChart3,
  LogOut,

  FileCheck,
  X,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Certificates', href: '/dashboard/certificates', icon: Award },
  { name: 'Generate', href: '/dashboard/certificates/new', icon: PlusCircle },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Activity Logs', href: '/dashboard/activity', icon: Activity },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { admin, logout } = useAuth();


  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in" onClick={onClose} />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-[260px] bg-[#070714]/90 dark:bg-[#04040a]/90 text-white flex flex-col border-r border-slate-200/10 dark:border-white/5 transition-transform duration-300 lg:translate-x-0 backdrop-blur-xl",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-slate-200/10 dark:border-white/5">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <FileCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">CertGen</h1>
              <p className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">Verification SaaS</p>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden p-1.5 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative group",
                  isActive
                    ? "bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-[1.02]"
                    : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                )}
              >
                <item.icon className={cn(
                  "w-[18px] h-[18px] flex-shrink-0 transition-transform duration-300 group-hover:scale-110",
                  isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-400"
                )} />
                {item.name}
                {isActive && (
                  <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="px-4 py-6 border-t border-slate-200/10 dark:border-white/5 space-y-4">

          {/* Admin info & logout */}
          <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-xl border border-white/5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-violet-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-md">
              {admin?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-200 truncate">{admin?.name || 'Admin'}</p>
              <p className="text-xs text-slate-500 truncate">{admin?.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
