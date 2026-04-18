import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { FileMetadata, RecentShare, Toast, AppView } from '@/types';

interface FileStoreState {
  view: AppView;
  previousView: AppView | null;
  currentFile: File | null;
  currentFileMeta: FileMetadata | null;
  shareCode: string | null;
  uploadProgress: number;
  downloadProgress: number;
  isUploading: boolean;
  isDownloading: boolean;
  isConnected: boolean;
  recentShares: RecentShare[];
  toast: Toast | null;
  downloadCode: string | null;
  downloadError: string | null;
}

type Action =
  | { type: 'SET_VIEW'; view: AppView }
  | { type: 'SET_FILE'; file: File | null; meta: FileMetadata | null }
  | { type: 'START_UPLOAD' }
  | { type: 'SET_UPLOAD_PROGRESS'; progress: number }
  | { type: 'COMPLETE_UPLOAD'; code: string }
  | { type: 'START_DOWNLOAD' }
  | { type: 'SET_DOWNLOAD_PROGRESS'; progress: number }
  | { type: 'SET_CONNECTED'; connected: boolean }
  | { type: 'COMPLETE_DOWNLOAD' }
  | { type: 'SET_DOWNLOAD_CODE'; code: string }
  | { type: 'SET_DOWNLOAD_ERROR'; error: string | null }
  | { type: 'ADD_RECENT_SHARE'; share: RecentShare }
  | { type: 'CLEAR_RECENT_SHARES' }
  | { type: 'SHOW_TOAST'; toast: Toast }
  | { type: 'HIDE_TOAST' }
  | { type: 'RESET' }
  | { type: 'RESET_DOWNLOAD' };

const initialState: FileStoreState = {
  view: 'home',
  previousView: null,
  currentFile: null,
  currentFileMeta: null,
  shareCode: null,
  uploadProgress: 0,
  downloadProgress: 0,
  isUploading: false,
  isDownloading: false,
  isConnected: false,
  recentShares: JSON.parse(localStorage.getItem('droplink_recent') || '[]'),
  toast: null,
  downloadCode: null,
  downloadError: null,
};

function fileStoreReducer(state: FileStoreState, action: Action): FileStoreState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, previousView: state.view, view: action.view };
    case 'SET_FILE':
      return {
        ...state,
        currentFile: action.file,
        currentFileMeta: action.meta,
        uploadProgress: 0,
      };
    case 'START_UPLOAD':
      return { ...state, isUploading: true, uploadProgress: 0 };
    case 'SET_UPLOAD_PROGRESS':
      return { ...state, uploadProgress: action.progress };
    case 'COMPLETE_UPLOAD':
      return { ...state, isUploading: false, uploadProgress: 100, shareCode: action.code };
    case 'START_DOWNLOAD':
      return { ...state, isDownloading: true, downloadProgress: 0, isConnected: false };
    case 'SET_DOWNLOAD_PROGRESS':
      return { ...state, downloadProgress: action.progress };
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.connected };
    case 'COMPLETE_DOWNLOAD':
      return { ...state, isDownloading: false, downloadProgress: 100 };
    case 'SET_DOWNLOAD_CODE':
      return { ...state, downloadCode: action.code, downloadError: null };
    case 'SET_DOWNLOAD_ERROR':
      return { ...state, downloadError: action.error };
    case 'ADD_RECENT_SHARE': {
      const updated = [action.share, ...state.recentShares].slice(0, 10);
      localStorage.setItem('droplink_recent', JSON.stringify(updated));
      return { ...state, recentShares: updated };
    }
    case 'CLEAR_RECENT_SHARES':
      localStorage.removeItem('droplink_recent');
      return { ...state, recentShares: [] };
    case 'SHOW_TOAST':
      return { ...state, toast: action.toast };
    case 'HIDE_TOAST':
      return { ...state, toast: null };
    case 'RESET':
      return {
        ...initialState,
        view: 'home',
        previousView: null,
        recentShares: state.recentShares,
      };
    case 'RESET_DOWNLOAD':
      return {
        ...state,
        downloadCode: null,
        downloadError: null,
        downloadProgress: 0,
        isDownloading: false,
        isConnected: false,
      };
    default:
      return state;
  }
}

interface FileStoreContextType {
  state: FileStoreState;
  dispatch: React.Dispatch<Action>;
  setView: (view: AppView) => void;
  setFile: (file: File | null) => void;
  startUpload: () => void;
  startDownload: () => void;
  reset: () => void;
  resetDownload: () => void;
  showToast: (message: string, type: Toast['type']) => void;
  copyToClipboard: (text: string) => void;
}

const FileStoreContext = createContext<FileStoreContextType | null>(null);

export function FileStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(fileStoreReducer, initialState);

  const setView = useCallback((view: AppView) => {
    dispatch({ type: 'SET_VIEW', view });
  }, []);

  const setFile = useCallback((file: File | null) => {
    if (file) {
      const meta: FileMetadata = {
        name: file.name,
        size: file.size,
        type: file.type,
      };
      dispatch({ type: 'SET_FILE', file, meta });
    } else {
      dispatch({ type: 'SET_FILE', file: null, meta: null });
    }
  }, []);

  const startUpload = useCallback(() => {
    dispatch({ type: 'START_UPLOAD' });

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      dispatch({ type: 'SET_UPLOAD_PROGRESS', progress });

      if (progress >= 100) {
        clearInterval(interval);
        const code = generateShareCode();
        dispatch({ type: 'COMPLETE_UPLOAD', code });

        // Add to recent shares
        if (state.currentFileMeta) {
          const share: RecentShare = {
            code,
            fileName: state.currentFileMeta.name,
            fileSize: state.currentFileMeta.size,
            timestamp: Date.now(),
            fileType: state.currentFileMeta.type,
          };
          dispatch({ type: 'ADD_RECENT_SHARE', share });
        }

        // Auto-advance to share page
        setTimeout(() => {
          dispatch({ type: 'SET_VIEW', view: 'share' });
        }, 600);
      }
    }, 80);
  }, [state.currentFileMeta]);

  const startDownload = useCallback(() => {
    dispatch({ type: 'START_DOWNLOAD' });

    // Simulate peer connection
    setTimeout(() => {
      dispatch({ type: 'SET_CONNECTED', connected: true });

      // Simulate download progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 3;
        dispatch({ type: 'SET_DOWNLOAD_PROGRESS', progress });

        if (progress >= 100) {
          clearInterval(interval);
          dispatch({ type: 'COMPLETE_DOWNLOAD' });
        }
      }, 90);
    }, 1500);
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const resetDownload = useCallback(() => {
    dispatch({ type: 'RESET_DOWNLOAD' });
  }, []);

  const showToast = useCallback((message: string, type: Toast['type']) => {
    dispatch({ type: 'SHOW_TOAST', toast: { message, type } });
    setTimeout(() => {
      dispatch({ type: 'HIDE_TOAST' });
    }, 3000);
  }, []);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copied to clipboard!', 'success');
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast('Copied to clipboard!', 'success');
    }
  }, [showToast]);

  return (
    <FileStoreContext.Provider
      value={{
        state,
        dispatch,
        setView,
        setFile,
        startUpload,
        startDownload,
        reset,
        resetDownload,
        showToast,
        copyToClipboard,
      }}
    >
      {children}
    </FileStoreContext.Provider>
  );
}

export function useFileStore() {
  const context = useContext(FileStoreContext);
  if (!context) {
    throw new Error('useFileStore must be used within FileStoreProvider');
  }
  return context;
}

function generateShareCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
