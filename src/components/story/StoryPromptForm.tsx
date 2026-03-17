'use client'

import { useState } from "react";

interface StoryPromptFormProps {
  onSubmit: (prompt: string) => Promise<void>;
  disabled?: boolean;
}

export default function StoryPromptForm({ onSubmit, disabled = false }: StoryPromptFormProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() === "" || loading || disabled) return;
    setLoading(true);
    setError(null);
    try {
      await onSubmit(prompt);
      setPrompt(""); // clear on success
    } catch (e: any) {
      setError(e?.message || "Erro ao enviar prompt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
    >
      <div className="flex-1">
        <label htmlFor="story-prompt" className="sr-only">
          Continuar história
        </label>
        <input
          id="story-prompt"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading || disabled}
          placeholder="Digite sua continuação ou decisão..."
          className="w-full rounded-md border border-slate-600 bg-slate-900/40 px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        />
      </div>
      <button
        type="submit"
        disabled={prompt.trim() === "" || loading || disabled}
        className="inline-flex items-center justify-center rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-transform transition-colors hover:bg-sky-500 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.97]"
      >
        {loading ? (
          <>
            <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-transparent" />
            Gerando...
          </>
        ) : (
          "Gerar"
        )}
      </button>
      {error && (
        <div className="w-full text-sm text-red-400 sm:ml-1">
          {error}
        </div>
      )}
    </form>
  );
}