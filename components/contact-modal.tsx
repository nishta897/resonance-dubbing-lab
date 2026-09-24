"use client";

import { useState } from "react";

export function ContactModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-semibold text-white/65 hover:text-white"
      >
        Contact
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-black">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Contact us</h2>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xl"
              >
                ×
              </button>
            </div>

            <p className="mt-4 text-sm text-gray-600">
              Contact Resonance Dubbing Lab for more information.
            </p>

            <div className="mt-6">
              <a
                href="mailto:contact@resonancedubbinglab.com"
                className="font-semibold underline"
              >
                Send us an email
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}