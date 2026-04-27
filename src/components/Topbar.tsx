"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/search", label: "Search" },
  { href: "/setup", label: "Setup" },
] as const;

export function Topbar() {
  const pathname = usePathname();

  return (
    <header className="bg-brand-ink h-14 px-7 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 flex items-center justify-center text-sm font-medium rounded-sm"
          style={{
            background: "var(--brand-mustard)",
            border: "2.5px solid var(--brand-yellow)",
            color: "var(--brand-ink)",
          }}
        >
          J
        </div>
        <span className="text-base font-medium tracking-wide" style={{ color: "var(--brand-yellow)" }}>
          Judgy
        </span>
        <span className="text-[11px] ml-1 text-neutral-400 hidden sm:inline">
          hackathon judge panel
        </span>
      </Link>

      <nav className="flex items-center gap-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="px-3.5 py-1 text-xs font-medium rounded-sm border-2 transition-colors"
              style={
                isActive
                  ? {
                      background: "var(--brand-mustard)",
                      borderColor: "var(--brand-mustard)",
                      color: "var(--brand-ink)",
                    }
                  : {
                      background: "transparent",
                      borderColor: "#444",
                      color: "#ccc",
                    }
              }
            >
              {item.label}
            </Link>
          );
        })}
        <div
          className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-xs font-medium ml-2"
          style={{
            background: "var(--brand-mustard)",
            border: "2px solid #888",
            color: "var(--brand-ink)",
          }}
        >
          JG
        </div>
      </nav>
    </header>
  );
}