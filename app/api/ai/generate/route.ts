import { NextRequest, NextResponse } from "next/server";

type OpenRouterErrorShape = {
  error?: { message?: string } | string;
};

function readErrorMessage(data: unknown) {
  if (typeof data !== "object" || data === null) return null;
  const err = (data as OpenRouterErrorShape).error;
  if (typeof err === "string") return err;
  if (typeof err === "object" && err && typeof err.message === "string") return err.message;
  return null;
}

function partToText(part: unknown) {
  if (typeof part === "string") return part;
  if (typeof part !== "object" || part === null) return "";
  const rec = part as Record<string, unknown>;
  if (typeof rec.text === "string") return rec.text;
  if (typeof rec.content === "string") return rec.content;
  return "";
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, context } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: "Campo 'prompt' é obrigatório" },
        {status:400}
      )
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey) {
  return NextResponse.json(
    { error: "OPENROUTER_API_KEY não configurada" },
    { status: 500 }
  );
}
const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`,
    // Opcional, mas recomendado pela OpenRouter
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "AI Storytelling App",
  },
  body: JSON.stringify({
    model: process.env.OPENROUTER_MODEL ?? "meta-llama/llama-3.1-8b-instruct:free",
    messages: [
      {
        role: "system",
        content: [
          "Você é um escritor criativo de histórias interativas.",
          "Tom: fantasia leve, adequado para todos os públicos.",
          "Responda sempre em 2 a 4 frases, em português do Brasil.",
          "Mantenha coerência com o contexto fornecido e continue a narrativa de forma envolvente.",
          "Evite violência explícita, conteúdo sexual ou temas inadequados.",
        ].join(" "),
      },
      {
        role: "user",
        content: context
          ? `Contexto atual: ${context}\n\nDecisão do usuário / próximo passo: ${prompt}`
          : prompt,
      },
    ],
    max_tokens: 100,
  }),
});

    const data = await response.json();

    if (!response.ok) {
      const message =
        readErrorMessage(data) ?? "Erro ao se comunicar com o provedor de IA";

      const friendlyMessage =
        response.status === 429
          ? "Muitas requisições em pouco tempo ou limite do modelo atingido. Aguarde alguns segundos e tente novamente."
          : message;

      return NextResponse.json(
        { error: friendlyMessage },
        { status: response.status }
      );
    }


    // Tenta ler o conteúdo em diferentes formatos possíveis da OpenRouter/OpenAI
    const rawContent =
      data.choices?.[0]?.message?.content ??
      data.choices?.[0]?.content ??
      "";

    let text = "";

    if (typeof rawContent === "string") {
      text = rawContent.trim();
    } else if (Array.isArray(rawContent)) {
      // Alguns provedores retornam a mensagem como array de partes
      text = rawContent
        .map(partToText)
        .join(" ")
        .trim();
    } else if (rawContent && typeof rawContent === "object") {
      // Outros retornam como objeto com campo `text` ou `content`
      text =
        ((rawContent as Record<string, unknown>).text as string | undefined) ??
        ((rawContent as Record<string, unknown>).content as string | undefined) ??
        "";
      const parts = (rawContent as Record<string, unknown>).parts;
      if (Array.isArray(parts)) {
        const extra = parts.map(partToText).join(" ").trim();
        text = `${text ?? ""} ${extra}`.trim();
      }
    }

    if (!text) {
      // Em vez de falhar com 500, retornamos um erro sem quebrar o fluxo
      return NextResponse.json(
        { error: "Resposta vazia da IA" },
        { status: 500 }
      );
    }

    return NextResponse.json({ text });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao gerar texto" },
      { status: 500 }
    );
  }
}