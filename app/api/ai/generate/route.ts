import { NextRequest, NextResponse } from "next/server";

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
        (data as any)?.error?.message ||
        (data as any)?.error ||
        "Erro ao se comunicar com o provedor de IA";

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
        .map((part: any) => {
          if (typeof part === "string") return part;
          if (part?.text) return part.text;
          if (part?.content) return part.content;
          return "";
        })
        .join(" ")
        .trim();
    } else if (rawContent && typeof rawContent === "object") {
      // Outros retornam como objeto com campo `text` ou `content`
      text =
        (rawContent as any).text ??
        (rawContent as any).content ??
        "";
      if (Array.isArray((rawContent as any).parts)) {
        const extra = (rawContent as any).parts
          .map((p: any) => p?.text ?? "")
          .join(" ")
          .trim();
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
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao gerar texto" },
      { status: 500 }
    );
  }
}