import { useEffect } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { LANDING_KEY } from "@/hooks/use-app-settings";

const SESSION_FLAG = "devtk:landing-applied";

/**
 * Honours the "default landing page" setting: when the user opens "/" and has
 * chosen All tools or Favorites, redirect once per browser session.
 */
export function LandingRedirect() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (pathname !== "/") return;
    try {
      if (window.sessionStorage.getItem(SESSION_FLAG)) return;
      const raw = window.localStorage.getItem(LANDING_KEY);
      const pref = raw ? (JSON.parse(raw) as string) : "home";
      window.sessionStorage.setItem(SESSION_FLAG, "1");
      if (pref === "tools") navigate({ to: "/tools", replace: true });
      else if (pref === "favorites") navigate({ to: "/favorites", replace: true });
    } catch {
      /* ignore */
    }
  }, [pathname, navigate]);

  return null;
}
