"use client";

import { useCallback, useEffect, useState } from "react";
import { getOrgsService, type HubOrganization } from "@/lib/services/orgs.service";

export type OrgsStatus = "loading" | "success" | "error" | "empty";

interface UseOrgsResult {
  orgs: HubOrganization[];
  status: OrgsStatus;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Data-fetch de organizaciones del usuario (GET /orgs).
 * Compartido por la página /organizaciones y las secciones del Overview.
 */
export function useOrgs(): UseOrgsResult {
  const [orgs, setOrgs] = useState<HubOrganization[]>([]);
  const [status, setStatus] = useState<OrgsStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  const fetchOrgs = useCallback(async () => {
    try {
      const data = await getOrgsService();
      setOrgs(data);
      setStatus(data.length === 0 ? "empty" : "success");
      setError(null);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Error al cargar organizaciones");
    }
  }, []);

  useEffect(() => {
    // La primera petición se dispara aquí; todos los setState ocurren tras el
    // `await getOrgsService()`, por lo que no hay setState síncrono en el effect.
    void (async () => {
      try {
        const data = await getOrgsService();
        setOrgs(data);
        setStatus(data.length === 0 ? "empty" : "success");
        setError(null);
      } catch (err) {
        setStatus("error");
        setError(err instanceof Error ? err.message : "Error al cargar organizaciones");
      }
    })();
  }, []);

  return { orgs, status, error, refetch: fetchOrgs };
}