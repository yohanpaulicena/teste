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
import { useAvailability } from "@/components/AvailabilityProvider";

const navItems = [
  { href: "/dashboard/geral", label: "Geral", icon: LayoutDashboard, key: "geral" },
  { href: "/dashboard/trafego", label: "Tráfego", icon: BarChart3, key: "trafego" },
  { href: "/dashboard/meta-ads", label: "Meta Ads", icon: Megaphone, key: "meta_ads" },
  { href: "/dashboard/google-ads", label: "Google Ads", icon: Globe2, key: "google_ads" },
  { href: "/dashboard/social", label: "Orgânico", icon: Share2, key: "social" },
  { href: "/dashboard/instagram", label: "Instagram Orgânico", icon: Instagram, key: "instagram" },
  { href: "/dashboard/facebook", label: "Facebook Orgânico", icon: Facebook, key: "facebook" },
  { href: "/dashboard/configuracoes", label: "Configurações", icon: Settings, disabled: true, key: "config" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { availability } = useAvailability();
  const hasAvailability = Object.keys(availability).length > 0;
  const hasPaid = !hasAvailability || availability.meta_ads || availability.google_ads;
  const hasOrganic = !hasAvailability || availability.instagram || availability.facebook;
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
            const isDisabled =
              item.disabled ||
              (hasAvailability && item.key === "meta_ads" && !availability.meta_ads) ||
              (hasAvailability && item.key === "google_ads" && !availability.google_ads) ||
              (hasAvailability && item.key === "instagram" && !availability.instagram) ||
              (hasAvailability && item.key === "facebook" && !availability.facebook) ||
              (item.key === "trafego" && !hasPaid) ||
              (item.key === "social" && !hasOrganic);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={isDisabled ? "#" : item.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gradient-to-r from-neonCyan/20 to-neonPink/20 text-white"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                } ${isDisabled ? "opacity-40 cursor-not-allowed" : ""}`}
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
