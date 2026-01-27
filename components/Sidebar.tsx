"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  LayoutDashboard,
  Megaphone,
  Settings,
  Share2,
  Instagram,
  Facebook,
  Globe2,
} from "lucide-react";

const navItems = [
  { href: "/dashboard/geral", label: "Geral", icon: LayoutDashboard },
  { href: "/dashboard/trafego", label: "Tráfego", icon: BarChart3 },
  { href: "/dashboard/meta-ads", label: "Meta Ads", icon: Megaphone },
  { href: "/dashboard/google-ads", label: "Google Ads", icon: Globe2 },
  { href: "/dashboard/social", label: "Orgânico", icon: Share2 },
  { href: "/dashboard/instagram", label: "Instagram Orgânico", icon: Instagram },
  { href: "/dashboard/facebook", label: "Facebook Orgânico", icon: Facebook },
  { href: "/dashboard/configuracoes", label: "Configurações", icon: Settings, disabled: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0">
      <div className="card-glass rounded-3xl p-6 shadow-card bg-bg1/70">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-neonCyan to-neonPink flex items-center justify-center font-bold text-bg0">
            A
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Agency</p>
            <h2 className="text-lg font-semibold">Premium Suite</h2>
          </div>
        </div>

        <nav className="mt-8 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.disabled ? "#" : item.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gradient-to-r from-neonCyan/20 to-neonPink/20 text-white"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                } ${item.disabled ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
