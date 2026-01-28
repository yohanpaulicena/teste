"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAvailability } from "@/components/AvailabilityProvider";

export const useSourceGuard = (keys: string | string[]) => {
  const router = useRouter();
  const { availability } = useAvailability();
  const keyList = Array.isArray(keys) ? keys : [keys];

  useEffect(() => {
    const hasKnownKey = keyList.some((key) => key in availability);
    const isUnavailable =
      hasKnownKey && keyList.every((key) => availability[key as keyof typeof availability] === false);
    if (isUnavailable) {
      router.replace("/dashboard/geral");
    }
  }, [availability, keyList, router]);
};
