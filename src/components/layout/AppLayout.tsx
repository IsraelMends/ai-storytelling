import { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          padding: "24px 0",
          background: "#2563eb",
          color: "white",
          textAlign: "center",
          fontWeight: 600,
          letterSpacing: 1,
          fontSize: 22,
          boxShadow: "0 2px 8px 0 rgba(30,41,59,0.05)"
        }}
      >
        IA Storytelling Demo
      </header>
      <main style={{ flex: 1, maxWidth: 720, margin: "32px auto", width: "100%", padding: "0 16px" }}>
        {children}
      </main>
    </div>
  );
}