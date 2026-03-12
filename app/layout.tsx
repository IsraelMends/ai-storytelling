// app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import { StoryProvider } from "../src/contexts/StoryContext";

export const metadata: Metadata = {
  title: "AI Storytelling",
  description: "Plataforma de storytelling interativo com IA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body style={{ minHeight: "100vh", background: "#f1f5f9" }}>
        <StoryProvider>
          {children}
        </StoryProvider>
      </body>
    </html>
  );
}