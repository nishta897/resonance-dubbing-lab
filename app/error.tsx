"use client";

import { AlertCircle, RotateCcw } from "lucide-react";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-cloud p-6">
      <section className="surface max-w-lg p-8 text-center sm:p-12">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-600"><AlertCircle size={25} /></span>
        <h1 className="mt-6 text-3xl font-black">Resonance hit an unexpected error.</h1>
        <p className="mt-3 leading-7 text-slate-600">Your guest session is safe. Retry this screen, then check the setup guide if the problem continues.</p>
        <button type="button" className="button-dark mt-7" onClick={reset}><RotateCcw size={17} /> Try again</button>
      </section>
    </main>
  );
}
