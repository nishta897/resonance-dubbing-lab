import Link from "next/link";
import { Header } from "../components/header";
import { ContactModal } from "../components/contact-modal";
import { PricingCalculator } from "../components/pricing-calculator";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />

      <section className="container-shell px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-extrabold">
            Resonance Dubbing Lab
          </h1>

          <p className="mt-6 text-lg text-white/70">
            Indian-language video localization powered by AI.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/dashboard"
              className="rounded-full bg-lime px-6 py-3 font-bold text-black"
            >
              Open Dashboard
            </Link>

            <ContactModal />
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-xl">
          <PricingCalculator />
        </div>
      </section>
    </main>
  );
}