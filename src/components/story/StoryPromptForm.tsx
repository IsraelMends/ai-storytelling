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
    <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={loading || disabled}
        placeholder="Digite sua continuação ou decisão..."
        style={{ minWidth: 280, padding: 8, marginRight: 8 }}
      />
      <button
        type="submit"
        disabled={prompt.trim() === "" || loading || disabled}
        style={{ padding: "8px 16px" }}
      >
        {loading ? "Gerando..." : "Gerar"}
      </button>
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    </form>
  );
}