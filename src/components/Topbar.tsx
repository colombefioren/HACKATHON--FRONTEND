"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/search", label: "Search" },
  { href: "/setup", label: "Setup" },
] as const;

export function Topbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-brand-ink" style={{ borderBottom: "2.5px solid var(--brand-mustard)" }}>
      <div className="h-14 px-4 sm:px-7 flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
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
            Evalio
          </span>
          <span className="text-[11px] ml-1 text-neutral-400 hidden sm:inline">
            hackathon judge panel
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-2">
          {navItems.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
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

        {/* Mobile hamburger */}
        <button
          className="sm:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span
            className="block w-5 h-0.5 transition-transform origin-center"
            style={{
              background: "var(--brand-yellow)",
              transform: menuOpen ? "translateY(8px) rotate(45deg)" : "none",
            }}
          />
          <span
            className="block w-5 h-0.5 transition-opacity"
            style={{
              background: "var(--brand-yellow)",
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            className="block w-5 h-0.5 transition-transform origin-center"
            style={{
              background: "var(--brand-yellow)",
              transform: menuOpen ? "translateY(-8px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav
          className="sm:hidden flex flex-col px-4 pb-4 gap-2"
          style={{ borderTop: "1.5px solid #333" }}
        >
          {navItems.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2.5 text-sm font-medium rounded-md"
                style={
                  isActive
                    ? {
                        background: "var(--brand-mustard)",
                        color: "var(--brand-ink)",
                        border: "2px solid var(--brand-mustard)",
                      }
                    : {
                        background: "transparent",
                        color: "#ccc",
                        border: "2px solid #444",
                      }
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
