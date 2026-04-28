"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/search", label: "Search" },
] as const;

interface TopbarProps {
  submissionsOpen?: boolean;
}

export function Topbar({ submissionsOpen }: TopbarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="bg-brand-ink" style={{ borderBottom: "2.5px solid var(--brand-mustard)" }}>
      <div className="h-14 px-4 sm:px-7 flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <img
            src="/evalio.svg"
            alt="Evalio"
            className="w-8 h-8"
          />
          <span className="text-base font-medium tracking-wide" style={{ color: "var(--brand-yellow)" }}>
            Evalio
          </span>
          <span className="text-[11px] ml-1 text-neutral-400 hidden sm:inline">
            hackathon judge panel
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-2">
            {submissionsOpen !== undefined && (
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-sm mr-2"
                style={{
                  background: submissionsOpen ? "var(--brand-mint)" : "var(--brand-coral)",
                  border: "1.5px solid var(--brand-ink)",
                  color: "var(--brand-ink)",
                }}
              >
                {submissionsOpen ? "● Open" : "● Closed"}
              </span>
            )}
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
                      ? { background: "var(--brand-mustard)", borderColor: "var(--brand-mustard)", color: "var(--brand-ink)" }
                      : { background: "transparent", borderColor: "#444", color: "#ccc" }
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          {user && (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1 rounded-full transition-opacity hover:opacity-80"
                style={{ border: "2px solid var(--brand-yellow)" }}
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.image ?? undefined} />
                </Avatar>
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-64 py-2 z-50"
                  style={{
                    background: "white",
                    border: "2.5px solid var(--brand-ink)",
                    boxShadow: "5px 5px 0 var(--brand-ink)",
                    borderRadius: "3px",
                  }}
                >
                  <div className="px-4 py-3" style={{ borderBottom: "1.5px solid var(--brand-ink)" }}>
                    <p className="text-sm font-medium text-brand-ink">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      router.push("/profile");
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-brand-ink hover:bg-[var(--brand-yellow)] transition-colors"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      router.push("/profile/settings");
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-brand-ink hover:bg-[var(--brand-yellow)] transition-colors"
                    style={{ borderTop: "1.5px solid var(--brand-ink)" }}
                  >
                    Settings
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="sm:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className="block w-5 h-0.5 transition-transform origin-center"
              style={{ background: "var(--brand-yellow)", transform: menuOpen ? "translateY(8px) rotate(45deg)" : "none" }} />
            <span className="block w-5 h-0.5 transition-opacity"
              style={{ background: "var(--brand-yellow)", opacity: menuOpen ? 0 : 1 }} />
            <span className="block w-5 h-0.5 transition-transform origin-center"
              style={{ background: "var(--brand-yellow)", transform: menuOpen ? "translateY(-8px) rotate(-45deg)" : "none" }} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav className="sm:hidden flex flex-col px-4 pb-4 gap-2" style={{ borderTop: "1.5px solid #333" }}>
          {submissionsOpen !== undefined && (
            <span
              className="text-[10px] font-medium px-2 py-1 rounded-sm self-start"
              style={{
                background: submissionsOpen ? "var(--brand-mint)" : "var(--brand-coral)",
                border: "1.5px solid var(--brand-ink)",
                color: "var(--brand-ink)",
              }}
            >
              Submissions {submissionsOpen ? "open" : "closed"}
            </span>
          )}
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
                    ? { background: "var(--brand-mustard)", color: "var(--brand-ink)", border: "2px solid var(--brand-mustard)" }
                    : { background: "transparent", color: "#ccc", border: "2px solid #444" }
                }
              >
                {item.label}
              </Link>
            );
          })}
          {user && (
            <>
              <div style={{ borderTop: "1.5px solid #333", paddingTop: "8px" }}>
                <p className="px-4 py-1 text-xs text-neutral-400">Signed in as</p>
                <p className="px-4 py-1 text-sm text-white">{user.firstName} {user.lastName}</p>
                <p className="px-4 py-0.5 text-xs text-neutral-400">{user.email}</p>
              </div>
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2.5 text-sm font-medium rounded-md text-center"
                style={{ background: "var(--brand-mustard)", color: "var(--brand-ink)", border: "2px solid var(--brand-mustard)" }}
              >
                Profile
              </Link>
              <Link
                href="/profile/settings"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2.5 text-sm font-medium rounded-md text-center"
                style={{ background: "transparent", color: "#ccc", border: "2px solid #444" }}
              >
                Settings
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
