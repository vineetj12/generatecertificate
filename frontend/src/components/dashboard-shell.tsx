'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from '@/components/sidebar';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 relative overflow-hidden bg-[#05050e]">
      {/* Background glow effects */}
      <div className="glow-bg" />

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="lg:pl-[260px] relative z-10 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center gap-4 px-6 py-4 bg-[#070714]/70 dark:bg-[#04040a]/70 backdrop-blur-md border-b border-slate-200/10 dark:border-white/5 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 active:scale-95 transition-all"
          >
            <Menu className="w-5 h-5 text-slate-200" />
          </button>
          <h1 className="text-lg font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">CertGen</h1>
        </header>

        <main className="flex-1 p-6 md:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
