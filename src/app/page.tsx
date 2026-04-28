"use client";

import { useState } from "react";
import { Topbar } from "@/components/Topbar";
import { HackathonCard } from "@/components/HackathonCard";
import { CreateHackathonModal } from "@/components/CreateHackathonModal";
import { useHackathons } from "@/lib/hooks/useHackathons";
import { EmptyState } from "@/components/EmptyState";
import { Trophy } from "lucide-react";
import { hackathonId } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export default function DashboardPage() {


        const router = useRouter();
      
      const user = useUserStore(state=>state.user);
      
      if(!user){
        router.push("/auth");
      }
  const { data: hackathons = [], isLoading, error, refetch } = useHackathons();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Topbar />

      <main className="px-4 sm:px-7 py-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-medium">Hackathons</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {hackathons.length > 0
                ? `${hackathons.length} hackathon${hackathons.length !== 1 ? "s" : ""}`
                : "No hackathons yet"}
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="text-sm font-medium px-4 py-2 rounded-md press-brutal"
            style={{
              background: "var(--brand-coral)",
              color: "var(--brand-ink)",
              border: "2.5px solid var(--brand-ink)",
              boxShadow: "4px 4px 0 var(--brand-ink)",
            }}
          >
            + New hackathon
          </button>
        </div>

        {/* Error */}
        {error && (
          <div
            className="p-4 rounded-lg text-sm mb-6 bg-card flex items-center justify-between"
            style={{ border: "2.5px solid var(--destructive)", boxShadow: "4px 4px 0 var(--destructive)" }}
          >
            <span>Couldn&apos;t reach the Evalio API: {(error as Error).message}</span>
            <button
              onClick={() => refetch()}
              className="text-xs font-medium px-3 py-1 rounded-sm press-brutal ml-4 shrink-0"
              style={{ border: "1.5px solid var(--destructive)", color: "var(--destructive)" }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <HackathonSkeleton key={i} />)
            : hackathons.map((h, i) => (
                <HackathonCard key={hackathonId(h) ?? i} hackathon={h} index={i} />
              ))}
        </div>

        {/* Empty state */}
        {!isLoading && hackathons.length === 0 && !error && (
          <EmptyState
            icon={Trophy}
            title="No hackathons yet"
            description="Create your first hackathon to start collecting and evaluating projects with AI agents."
            action={{ label: "+ Create hackathon", onClick: () => setModalOpen(true) }}
          />
        )}
      </main>

      <CreateHackathonModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

function HackathonSkeleton() {
  return (
    <div
      className="bg-card rounded-lg overflow-hidden"
      style={{ border: "2.5px solid var(--brand-ink)", boxShadow: "5px 5px 0 var(--brand-ink)" }}
    >
      <div className="h-1.5 bg-neutral-200 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between gap-3">
          <div className="h-5 bg-neutral-200 rounded animate-pulse flex-1" />
          <div className="h-5 w-14 bg-neutral-100 rounded animate-pulse" />
        </div>
        <div className="h-3 bg-neutral-100 rounded animate-pulse w-full" />
        <div className="h-3 bg-neutral-100 rounded animate-pulse w-3/4" />
        <div className="flex gap-1.5 pt-1">
          <div className="h-4 w-16 bg-neutral-200 rounded animate-pulse" />
          <div className="h-4 w-16 bg-neutral-200 rounded animate-pulse" />
          <div className="h-4 w-16 bg-neutral-200 rounded animate-pulse" />
        </div>
        <div className="h-px bg-neutral-200 animate-pulse" />
        <div className="flex justify-between">
          <div className="h-4 w-20 bg-neutral-100 rounded animate-pulse" />
          <div className="h-5 w-12 bg-neutral-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
