export function LoadingSpinner({ message = "Carregando..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-400 border-t-transparent" />
      <p className="text-slate-400 text-sm">{message}</p>
    </div>
  );
}
