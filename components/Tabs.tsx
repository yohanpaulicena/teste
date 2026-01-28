"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAvailability } from "@/components/AvailabilityProvider";

const tabItems = [
  { href: "/dashboard/geral", label: "Geral", key: "geral" },
  { href: "/dashboard/trafego", label: "Tráfego", key: "trafego" },
  { href: "/dashboard/meta-ads", label: "Meta Ads", key: "meta_ads" },
  { href: "/dashboard/google-ads", label: "Google Ads", key: "google_ads" },
  { href: "/dashboard/social", label: "Orgânico", key: "social" },
  { href: "/dashboard/instagram", label: "Instagram Orgânico", key: "instagram" },
  { href: "/dashboard/facebook", label: "Facebook Orgânico", key: "facebook" },
];

export default function Tabs() {
  const pathname = usePathname();
  const { availability } = useAvailability();
  const hasAvailability = Object.keys(availability).length > 0;
  const hasPaid = !hasAvailability || availability.meta_ads || availability.google_ads;
  const hasOrganic = !hasAvailability || availability.instagram || availability.facebook;
  return (
    <div className="flex flex-wrap gap-2">
      {tabItems.map((tab) => {
        const active = pathname === tab.href;
        const disabled =
          (hasAvailability && tab.key === "meta_ads" && !availability.meta_ads) ||
          (hasAvailability && tab.key === "google_ads" && !availability.google_ads) ||
          (hasAvailability && tab.key === "instagram" && !availability.instagram) ||
          (hasAvailability && tab.key === "facebook" && !availability.facebook) ||
          (tab.key === "trafego" && !hasPaid) ||
          (tab.key === "social" && !hasOrganic);
        return (
          <Link
            key={tab.href}
            href={disabled ? "#" : tab.href}
            className={`rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] transition ${
              active
                ? "border-neonCyan/70 bg-white/10 text-white shadow-glow"
                : "border-white/10 text-slate-400 hover:text-white"
            } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
