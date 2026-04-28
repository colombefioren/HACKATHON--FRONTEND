"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BlurFade,
  WordRotate,
  NumberTicker,
  Marquee,
  ShimmerButton,
  BorderBeam,
} from "@/components/magic";

const TECH = ["Next.js", "FastAPI", "MongoDB", "Google Vertex AI", "LangChain", "Python", "Tailwind CSS", "TanStack Query"];

export default function LandingPage() {
  return (
    <div style={{ background: "#fff", color: "#111" }} className="min-h-screen">
      <Navbar />
      <Hero />
      <StatsStrip />
      <HowItWorks />
      <Features />
      <TechStack />
      <CtaBanner />
      <Footer />
    </div>
  );
}

/* ── Navbar ── */
function Navbar() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 80 && y > last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 bg-white px-6 sm:px-10 h-16 flex items-center justify-between"
      style={{
        borderBottom: "2px solid #111",
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 0.3s ease",
      }}
    >
      <a href="#top" className="flex items-center gap-2.5">
        <div
          className="w-9 h-9 flex items-center justify-center font-extrabold rounded-[4px]"
          style={{ background: "#FFDB58", border: "2.5px solid #111", boxShadow: "3px 3px 0 #111" }}
        >
          <img src="evalio.svg" alt="logo" />
        </div>
        <span className="font-extrabold text-lg tracking-tight">Evalio</span>
      </a>
      <nav className="flex items-center gap-1 sm:gap-3">
        <a href="#how" className="hidden sm:inline px-3 py-1.5 text-sm font-medium hover:underline">How it works</a>
        <a href="#features" className="hidden sm:inline px-3 py-1.5 text-sm font-medium hover:underline">Features</a>
        <a href="#agents" className="hidden sm:inline px-3 py-1.5 text-sm font-medium hover:underline">Agents</a>
        <Link
          href="/dashboard"
          className="ml-2 px-4 py-2 text-sm font-bold rounded-[4px] press-brutal"
          style={{ background: "#FF7A5C", border: "2.5px solid #111", boxShadow: "3px 3px 0 #111", color: "#111" }}
        >
          Get started
        </Link>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="px-6 sm:px-10 pt-16 pb-20 max-w-6xl mx-auto text-center">
      <BlurFade delay={0.1}>
        <h1 className="mt-6 text-4xl sm:text-6xl font-extrabold leading-[1.05] tracking-tight">
          Your trusted ally for<br />
          <span style={{ color: "#FF7A5C" }}>
            <WordRotate words={["hackathon judging", "AI evaluation", "project analysis"]} />
          </span>
        </h1>
      </BlurFade>
      <BlurFade delay={0.2}>
        <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-neutral-700">
          Evalio analyzes every submission automatically — market research, code quality, and more — so Evalios can focus on what matters.
        </p>
      </BlurFade>
      <BlurFade delay={0.3}>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/dashboard">
            <ShimmerButton>Start judging →</ShimmerButton>
          </Link>
          <a
            href="#how"
            className="px-6 py-3 text-sm font-bold rounded-[4px] bg-white press-brutal"
            style={{ border: "2.5px solid #111", boxShadow: "4px 4px 0 #111" }}
          >
            See how it works ↓
          </a>
        </div>
      </BlurFade>
      <BlurFade delay={0.4}>
        <div className="mt-16 max-w-4xl mx-auto">
          <BorderBeam>
            <DashboardPreview />
          </BorderBeam>
        </div>
      </BlurFade>
    </section>
  );
}

function DashboardPreview() {
  const cards = [
    { color: "#90EE90", title: "DocuMind AI", status: "Analyzed", badge: "#90EE90" },
    { color: "#A388EE", title: "PitchPerfect", status: "Analyzed", badge: "#90EE90" },
    { color: "#FF7A5C", title: "GreenTrack", status: "Pending", badge: "#FFDB58" },
    { color: "#87CEEB", title: "CodeMentor", status: "Analyzed", badge: "#90EE90" },
    { color: "#FFB2EF", title: "FairTrade", status: "Flagged", badge: "#FF7A5C" },
    { color: "#FFDB58", title: "MeshNet", status: "Analyzed", badge: "#90EE90" },
  ];
  return (
    <div className="rounded-[4px] bg-white text-left overflow-hidden" style={{ border: "2.5px solid #111", boxShadow: "6px 6px 0 #111" }}>
      <div className="flex items-center gap-2 px-3 py-2" style={{ borderBottom: "2px solid #111", background: "#FFDB58" }}>
        <span className="w-3 h-3 rounded-full" style={{ background: "#FF7A5C", border: "1.5px solid #111" }} />
        <span className="w-3 h-3 rounded-full" style={{ background: "#FFDB58", border: "1.5px solid #111" }} />
        <span className="w-3 h-3 rounded-full" style={{ background: "#90EE90", border: "1.5px solid #111" }} />
        <span className="ml-3 text-xs font-medium">evalio.app/dashboard</span>
      </div>
      <div className="grid grid-cols-3 gap-3 p-4" style={{ borderBottom: "2px solid #111" }}>
        {[{ n: "24", l: "Projects" }, { n: "18", l: "Analyzed" }, { n: "6", l: "Pending" }].map((s) => (
          <div key={s.l} className="rounded-[4px] p-3 bg-white" style={{ border: "2px solid #111", boxShadow: "3px 3px 0 #111" }}>
            <div className="text-2xl font-extrabold">{s.n}</div>
            <div className="text-[11px] text-neutral-600 font-medium uppercase tracking-wide">{s.l}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4">
        {cards.map((c) => (
          <div key={c.title} className="rounded-[4px] bg-white overflow-hidden" style={{ border: "2px solid #111", boxShadow: "3px 3px 0 #111" }}>
            <div style={{ background: c.color, height: 7, borderBottom: "2px solid #111" }} />
            <div className="p-3">
              <div className="text-sm font-bold">{c.title}</div>
              <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold rounded-[3px]" style={{ background: c.badge, border: "1.5px solid #111" }}>
                {c.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Stats strip ── */
function StatsStrip() {
  const stats = [
    { v: 24, suffix: "+", l: "Projects analyzed per hackathon" },
    { v: 4, suffix: "", l: "Specialized AI agents" },
    { v: 100, suffix: "%", l: "Automated analysis" },
  ];
  return (
    <section className="w-full py-12 px-6" style={{ background: "#FFDB58", borderTop: "2.5px solid #111", borderBottom: "2.5px solid #111" }}>
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        {stats.map((s) => (
          <BlurFade key={s.l}>
            <div className="text-5xl font-extrabold">
              <NumberTicker value={s.v} suffix={s.suffix} />
            </div>
            <div className="mt-2 text-sm font-bold">{s.l}</div>
          </BlurFade>
        ))}
      </div>
    </section>
  );
}

/* ── How it works ── */
function HowItWorks() {
  const steps = [
    { n: 1, t: "Submit a project", d: "Drop in a GitHub link and short description." },
    { n: 2, t: "Agents analyze it", d: "Market, code, chat & search agents run in parallel." },
    { n: 3, t: "Evalio with confidence", d: "Review structured insights and ask follow-ups." },
  ];
  return (
    <section id="how" className="px-6 sm:px-10 py-20 max-w-6xl mx-auto">
      <BlurFade>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center">How it works</h2>
      </BlurFade>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((s, i) => (
          <BlurFade key={s.n} delay={0.1 * i}>
            <div className="text-center px-4">
              <div
                className="mx-auto w-14 h-14 rounded-full flex items-center justify-center text-xl font-extrabold"
                style={{ background: "#111", color: "#FFDB58", border: "2.5px solid #111", boxShadow: "4px 4px 0 #FFDB58" }}
              >
                {s.n}
              </div>
              <h3 className="mt-5 text-lg font-extrabold">{s.t}</h3>
              <p className="mt-2 text-sm text-neutral-700">{s.d}</p>
            </div>
          </BlurFade>
        ))}
      </div>
    </section>
  );
}

/* ── Features ── */
function Features() {
  const cells = [
    { color: "#90EE90", title: "Market Research Agent", desc: "Analyzes target market size, competitors, and uniqueness.", large: true, icon: <IconMarket /> },
    { color: "#FFB2EF", title: "Code Analysis Agent", desc: "Scans full codebase for tech stack, quality, and rule compliance.", icon: <IconCode /> },
    { color: "#A388EE", title: "Chat Agent", desc: "Interactive Q&A combining market + code insights.", icon: <IconChat /> },
    { color: "#87CEEB", title: "Search Agent", desc: "Find any submission with plain-English semantic search.", large: true, icon: <IconSearch /> },
  ];
  return (
    <section id="features" className="px-6 sm:px-10 py-20 max-w-6xl mx-auto">
      <BlurFade>
        <h2 id="agents" className="text-3xl sm:text-4xl font-extrabold text-center">Four agents. One verdict.</h2>
        <p className="mt-3 text-center text-neutral-700 max-w-xl mx-auto">Every submission is reviewed by specialised AI agents working together.</p>
      </BlurFade>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
        {cells.map((c, i) => (
          <BlurFade key={c.title} delay={0.08 * i} className={c.large ? "md:col-span-2" : "md:col-span-1"}>
            <div className="rounded-[4px] bg-white overflow-hidden h-full" style={{ border: "2.5px solid #111", boxShadow: "4px 4px 0 #111" }}>
              <div style={{ background: c.color, height: 7, borderBottom: "2.5px solid #111" }} />
              <div className="p-6">
                <div className="w-10 h-10 rounded-[4px] flex items-center justify-center mb-4" style={{ background: c.color, border: "2px solid #111" }}>
                  {c.icon}
                </div>
                <h3 className="text-lg font-extrabold">{c.title}</h3>
                <p className="mt-2 text-sm text-neutral-700">{c.desc}</p>
              </div>
            </div>
          </BlurFade>
        ))}
      </div>
    </section>
  );
}

/* ── Tech stack ── */
function TechStack() {
  return (
    <section className="py-16">
      <BlurFade>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-8">Built with</h2>
      </BlurFade>
      <Marquee>
        {TECH.map((t) => (
          <span key={t} className="px-4 py-2 text-sm font-bold bg-white rounded-[4px] whitespace-nowrap" style={{ border: "2px solid #111", boxShadow: "2px 2px 0 #111" }}>
            {t}
          </span>
        ))}
      </Marquee>
    </section>
  );
}

/* ── CTA banner ── */
function CtaBanner() {
  return (
    <section className="w-full py-20 px-6 text-center" style={{ background: "#111" }}>
      <BlurFade>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white">Ready to Evalio smarter?</h2>
        <p className="mt-4 text-base sm:text-lg font-medium" style={{ color: "#FFDB58" }}>Set up your hackathon in under 2 minutes.</p>
        <div className="mt-8 flex justify-center">
          <Link href="/dashboard">
            <ShimmerButton>Get started free →</ShimmerButton>
          </Link>
        </div>
      </BlurFade>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer className="bg-white px-6 sm:px-10 py-10" style={{ borderTop: "2.5px solid #111" }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center font-extrabold rounded-[4px]" style={{ background: "#FFDB58", border: "2.5px solid #111", boxShadow: "3px 3px 0 #111" }}>E</div>
          <div>
            <div className="font-extrabold">Evalio</div>
            <div className="text-xs text-neutral-600">Your trusted ally for hackathon judging.</div>
          </div>
        </div>
        <nav className="flex flex-wrap gap-5 text-sm font-medium">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/search" className="hover:underline">Search</Link>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
        </nav>
      </div>
      <div className="max-w-6xl mx-auto mt-8 pt-6 text-xs text-neutral-600 text-center" style={{ borderTop: "1.5px solid #111" }}>
        Built by Onlydevs · AI Hackathon Judging Platform
      </div>
    </footer>
  );
}

/* ── Icons ── */
function IconMarket() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M7 15l4-4 3 3 5-6" /></svg>;
}
function IconCode() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>;
}
function IconChat() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
}
function IconSearch() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
}
