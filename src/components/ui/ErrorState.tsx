'use client';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-8 text-center">
      <div className="text-red-400 text-4xl">⚠️</div>
      <p className="text-slate-300">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-sky-600 rounded-md hover:bg-sky-500 transition-colors"
        >
          Tentar Novamente
        </button>
      )}
    </div>
  );
}
