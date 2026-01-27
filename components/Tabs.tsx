"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabItems = [
  { href: "/dashboard/geral", label: "Geral" },
  { href: "/dashboard/trafego", label: "Tráfego" },
  { href: "/dashboard/meta-ads", label: "Meta Ads" },
  { href: "/dashboard/google-ads", label: "Google Ads" },
  { href: "/dashboard/social", label: "Orgânico" },
  { href: "/dashboard/instagram", label: "Instagram Orgânico" },
  { href: "/dashboard/facebook", label: "Facebook Orgânico" },
];

export default function Tabs() {
  const pathname = usePathname();
  return (
    <div className="flex flex-wrap gap-2">
      {tabItems.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] transition ${
              active
                ? "border-neonCyan/70 bg-white/10 text-white shadow-glow"
                : "border-white/10 text-slate-400 hover:text-white"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
