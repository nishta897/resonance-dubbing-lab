import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-cloud p-6">
      <section className="surface max-w-lg p-8 text-center sm:p-12">
        <p className="eyebrow text-cobalt">404 · Page not found</p>
        <h1 className="mt-5 text-4xl font-black tracking-[-0.055em]">This page has left the studio.</h1>
        <p className="mt-4 leading-7 text-slate-600">Return to Resonance Dubbing Lab and start a new dubbing project.</p>
        <Link href="/" className="button-dark mt-7"><ArrowLeft size={17} /> Back home</Link>
      </section>
    </main>
  );
}
