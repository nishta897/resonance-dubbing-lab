import type { Metadata } from "next";
import { DashboardStudio } from "@/components/dashboard-studio";

export const metadata: Metadata = {
  title: "Dubbing Studio",
  description: "Resonance Dubbing Lab video localization studio",
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#070b18] text-white">
      {/* Top header */}
      <header className="border-b border-white/10 bg-[#050816]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a
            href="/"
            className="text-xl font-extrabold tracking-tight text-white"
          >
            Resonance Dubbing Lab
          </a>

          <a
            href="/"
            className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            Back to Home
          </a>
        </div>
      </header>

      {/* Dashboard content */}
      <section className="relative overflow-hidden py-12 sm:py-16">
        {/* Background glow */}
        <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-lime-300/10 blur-3xl" />

        <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6">
          <DashboardStudio />
        </div>
      </section>
    </main>
  );
}