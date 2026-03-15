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

    const apiKey = process.env.AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key não configurada" },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Você é um escritor criativo. Gere um trecho curto de história (2-4 frases) baseado no prompt. Mantenha o tom narrativo."
          },
          {
            role: "user",
            content: context ? `Context: ${context}\n\nPrompt: ${prompt}` : prompt,
          }
        ],
        max_tokens: 100,
      }),
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim() ?? "";

    if (!text) {
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