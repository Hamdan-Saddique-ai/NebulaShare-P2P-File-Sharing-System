import { useState, useRef, useCallback } from 'react';
import { useFileStore } from '@/hooks/useFileStore';
import { Upload, File, Image, Video, Music, Archive, FileText, X } from 'lucide-react';
import { getFileIcon } from '@/lib/utils';

export default function DropZone() {
  const { state, setFile, startUpload } = useFileStore();
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setFile(files[0]);
    }
  }, [setFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  }, [setFile]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleClear = useCallback(() => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [setFile]);

  const getIconComponent = (type: string) => {
    const { icon } = getFileIcon(type);
    switch (icon) {
      case 'image': return <Image size={24} />;
      case 'video': return <Video size={24} />;
      case 'audio': return <Music size={24} />;
      case 'archive': return <Archive size={24} />;
      case 'doc': return <FileText size={24} />;
      default: return <File size={24} />;
    }
  };

  const hasFile = state.currentFile !== null;
  const fileInfo = state.currentFileMeta;

  return (
    <div className="w-full max-w-[680px] mx-auto">
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="Upload file"
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        className={`
          relative w-full min-h-[320px] rounded-2xl cursor-pointer
          transition-all duration-300 ease-out
          flex flex-col items-center justify-center
          ${isDragOver
            ? 'border-2 border-solid border-[#4F46E5] bg-[rgba(79,70,229,0.08)] scale-[1.02]'
            : hasFile
              ? 'border-2 border-solid border-[#2A2A2A] bg-[#141414]'
              : 'border-2 border-dashed border-[#2A2A2A] bg-[#141414] animate-pulse-border'
          }
        `}
        style={{
          background: hasFile
            ? '#141414'
            : 'linear-gradient(180deg, rgba(79, 70, 229, 0.03) 0%, #141414 100%)',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
        />

        {!hasFile ? (
          /* Idle State */
          <div className="flex flex-col items-center gap-4 text-center px-6">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
                isDragOver ? 'bg-[rgba(79,70,229,0.2)]' : 'bg-[rgba(79,70,229,0.1)]'
              }`}
            >
              <Upload
                size={32}
                className={`transition-colors duration-300 ${
                  isDragOver ? 'text-[#4F46E5]' : 'text-[#4F46E5]'
                }`}
              />
            </div>
            <div>
              <p className="text-xl font-semibold text-white">
                Drop your files here
              </p>
              <p className="text-sm text-[#737373] mt-1">
                or click to browse
              </p>
            </div>
            <p className="text-xs text-[#737373] mt-4">
              Up to 2GB per file
            </p>
          </div>
        ) : (
          /* File Selected State */
          <div className="flex flex-col items-center gap-4 text-center px-6">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-[#2A2A2A] transition-colors"
            >
              <X size={18} className="text-[#737373]" />
            </button>

            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: `${getFileIcon(fileInfo?.type || '').color}15` }}
            >
              <span style={{ color: getFileIcon(fileInfo?.type || '').color }}>
                {getIconComponent(fileInfo?.type || '')}
              </span>
            </div>

            <div>
              <p className="text-base font-medium text-white max-w-[300px] truncate">
                {fileInfo?.name}
              </p>
              <p className="text-sm text-[#A3A3A3] mt-1">
                {(fileInfo?.size ?? 0) > 0
                  ? `${(fileInfo!.size / 1024 / 1024).toFixed(1)} MB`
                  : ''}
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="text-sm text-[#4F46E5] hover:underline"
            >
              Change file
            </button>
          </div>
        )}
      </div>

      {/* Upload Button */}
      {hasFile && !state.isUploading && state.uploadProgress === 0 && (
        <button
          onClick={startUpload}
          className="w-full max-w-[400px] mx-auto mt-6 brand-gradient text-white font-semibold py-4 px-10 rounded-full hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Upload size={18} />
          Create Share Link
        </button>
      )}

      {/* Upload Progress */}
      {state.isUploading && (
        <div className="w-full max-w-[400px] mx-auto mt-6">
          <div className="w-full h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
            <div
              className="h-full brand-gradient rounded-full transition-all duration-100"
              style={{
                width: `${state.uploadProgress}%`,
                boxShadow: '0 0 8px rgba(79, 70, 229, 0.3)',
              }}
            />
          </div>
          <p className="text-sm text-[#A3A3A3] text-right mt-2">
            {state.uploadProgress}%
          </p>
        </div>
      )}

      {/* Upload Complete */}
      {!state.isUploading && state.uploadProgress === 100 && (
        <div className="w-full max-w-[400px] mx-auto mt-6 text-center">
          <p className="text-[#10B981] font-semibold animate-pulse">
            Link Ready!
          </p>
        </div>
      )}
    </div>
  );
}
