export interface FileMetadata {
  name: string;
  size: number;
  type: string;
}

export interface RecentShare {
  code: string;
  fileName: string;
  fileSize: number;
  timestamp: number;
  fileType: string;
}

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
}

export type AppView = 'home' | 'share' | 'download';
