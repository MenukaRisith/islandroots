// app/hooks/useMediaQuery.ts

import { useEffect, useState } from "react";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.matchMedia !== "undefined";
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (!isBrowser()) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (!isBrowser()) return;

    const mediaQueryList = window.matchMedia(query);

    const handleChange = (event: MediaQueryListEvent): void => {
      setMatches(event.matches);
    };

    setMatches(mediaQueryList.matches);

    mediaQueryList.addEventListener("change", handleChange);

    return () => {
      mediaQueryList.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}
