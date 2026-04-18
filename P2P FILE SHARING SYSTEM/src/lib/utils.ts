import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function formatTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function getFileIcon(type: string): { icon: string; color: string } {
  if (type.startsWith('image/')) return { icon: 'image', color: '#7C3AED' };
  if (type.startsWith('video/')) return { icon: 'video', color: '#4F46E5' };
  if (type.startsWith('audio/')) return { icon: 'audio', color: '#10B981' };
  if (type.includes('pdf')) return { icon: 'pdf', color: '#EF4444' };
  if (type.includes('zip') || type.includes('archive') || type.includes('compressed')) return { icon: 'archive', color: '#F59E0B' };
  if (type.includes('doc') || type.includes('word')) return { icon: 'doc', color: '#3B82F6' };
  if (type.includes('sheet') || type.includes('excel') || type.includes('csv')) return { icon: 'sheet', color: '#10B981' };
  return { icon: 'file', color: '#A3A3A3' };
}
