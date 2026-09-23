import { useCallback, useEffect, useState } from "react";

/** Ignore late responses after query changes or unmount. */
export function useResource<T>(load: () => Promise<T>) {
  const [result, setResult] = useState<{
    load: typeof load;
    revision: number;
    data: T | null;
    error: string | null;
  } | null>(null);
  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision((value) => value + 1), []);
  useEffect(() => {
    let cancelled = false;
    load()
      .then((data) => {
        if (!cancelled) setResult({ load, revision, data, error: null });
      })
      .catch((reason: unknown) => {
        if (!cancelled)
          setResult({
            load,
            revision,
            data: null,
            error:
              reason instanceof Error
                ? reason.message
                : "Something went wrong. Please try again.",
          });
      });
    return () => {
      cancelled = true;
    };
  }, [load, revision]);
  const current = result?.load === load && result.revision === revision;
  return {
    data: current ? result.data : null,
    loading: !current,
    error: current ? result.error : null,
    refresh,
  };
}
