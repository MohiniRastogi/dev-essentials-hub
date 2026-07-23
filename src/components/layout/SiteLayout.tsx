import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] overflow-hidden">
        <div className="absolute left-1/2 top-[-120px] h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute left-[10%] top-[80px] h-[220px] w-[420px] rounded-full bg-chart-4/20 blur-[120px]" />
        <div className="absolute right-[10%] top-[40px] h-[260px] w-[420px] rounded-full bg-chart-2/15 blur-[120px]" />
      </div>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}