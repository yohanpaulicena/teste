import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium Agency Dashboard",
  description: "Dashboard premium para resultados de social e tráfego pago.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Cache disabled for testing */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body>
        <div className="noise" />
        <div className="relative z-10">{children}</div>
        <div className="fixed bottom-4 right-4 z-20 rounded-full border border-neonCyan/60 bg-bg0/80 px-3 py-1 text-xs font-semibold text-neonCyan shadow-glow">
          DARK-NEON v1
        </div>
      </body>
    </html>
  );
}
