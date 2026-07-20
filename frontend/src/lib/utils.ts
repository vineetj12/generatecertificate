import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatMonthYear(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function getActionIcon(action: string): string {
  const icons: Record<string, string> = {
    created: '📄',
    deleted: '🗑️',
    downloaded: '⬇️',


    login: '🔐',
    company_updated: '🏢',
    logo_uploaded: '🖼️',
    signature_uploaded: '✍️',
    system_init: '⚙️',
  };
  return icons[action] || '📋';
}

export function getActionLabel(action: string): string {
  const labels: Record<string, string> = {
    created: 'Certificate Created',
    deleted: 'Certificate Revoked',
    downloaded: 'Certificate Downloaded',


    login: 'Admin Login',
    company_updated: 'Company Updated',
    logo_uploaded: 'Logo Uploaded',
    signature_uploaded: 'Signature Uploaded',
    system_init: 'System Initialized',
  };
  return labels[action] || action;
}
