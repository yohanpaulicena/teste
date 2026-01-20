import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium Agency Dashboard",
  description: "Dashboard premium para resultados de social e tráfego pago.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="noise" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
