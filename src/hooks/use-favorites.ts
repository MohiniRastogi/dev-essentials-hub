import { useCallback } from "react";
import { useLocalStorage } from "./use-local-storage";

export function useFavorites() {
  const [favs, setFavs] = useLocalStorage<string[]>("devtk:favorites", []);
  const toggle = useCallback(
    (slug: string) => {
      setFavs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
    },
    [setFavs],
  );
  const isFavorite = useCallback((slug: string) => favs.includes(slug), [favs]);
  return { favorites: favs, toggle, isFavorite };
}