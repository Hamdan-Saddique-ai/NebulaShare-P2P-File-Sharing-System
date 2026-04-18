import { useFileStore } from '@/hooks/useFileStore';
import { Check, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { state, dispatch } = useFileStore();

  if (!state.toast) return null;

  const icons = {
    success: <Check size={16} className="text-[#10B981]" />,
    error: <AlertCircle size={16} className="text-red-400" />,
    info: <Info size={16} className="text-[#4F46E5]" />,
  };

  const borderColors = {
    success: '#10B981',
    error: '#EF4444',
    info: '#4F46E5',
  };

  return (
    <div
      className="fixed bottom-4 right-4 z-[200] animate-[slideIn_0.3s_ease-out]"
      style={{
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      <div
        className="bg-[#141414] rounded-xl px-5 py-4 border border-[#2A2A2A] flex items-center gap-3"
        style={{
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
          borderLeft: `3px solid ${borderColors[state.toast.type]}`,
        }}
      >
        {icons[state.toast.type]}
        <span className="text-sm text-white">{state.toast.message}</span>
        <button
          onClick={() => dispatch({ type: 'HIDE_TOAST' })}
          className="ml-2 text-[#737373] hover:text-white transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
