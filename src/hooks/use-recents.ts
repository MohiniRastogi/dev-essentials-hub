import { useCallback, useEffect } from "react";
import { useLocalStorage } from "./use-local-storage";

const MAX = 8;

export function useRecents() {
  const [recents, setRecents] = useLocalStorage<string[]>("devtk:recents", []);
  const push = useCallback(
    (slug: string) => {
      setRecents((prev) => [slug, ...prev.filter((s) => s !== slug)].slice(0, MAX));
    },
    [setRecents],
  );
  return { recents, push };
}

export function useTrackRecent(slug: string | undefined) {
  const { push } = useRecents();
  useEffect(() => {
    if (slug) push(slug);
  }, [slug, push]);
}