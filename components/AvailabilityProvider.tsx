"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { Filters } from "@/components/FiltersBar";
import { currentUser } from "@/lib/auth";
import { fetchAvailability } from "@/lib/apiClient";

type AvailabilityState = {
  clientName: string;
  availability: Record<string, boolean>;
  loading: boolean;
  refresh: (filters: Filters) => void;
};

const AvailabilityContext = createContext<AvailabilityState | undefined>(undefined);

export function AvailabilityProvider({ children }: { children: React.ReactNode }) {
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const [clientName, setClientName] = useState(currentUser.clientName);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async (filters: Filters) => {
    setLoading(true);
    try {
      const response = await fetchAvailability(currentUser.clientId, filters);
      setAvailability(response.availability);
      setClientName(response.clientName);
    } catch {
      setAvailability({});
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      clientName,
      availability,
      loading,
      refresh,
    }),
    [availability, clientName, loading, refresh]
  );

  return <AvailabilityContext.Provider value={value}>{children}</AvailabilityContext.Provider>;
}

export const useAvailability = () => {
  const context = useContext(AvailabilityContext);
  if (!context) {
    throw new Error("useAvailability must be used within AvailabilityProvider.");
  }
  return context;
};
