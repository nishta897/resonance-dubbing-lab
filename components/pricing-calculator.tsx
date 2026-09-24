"use client";

import { useState } from "react";

export function PricingCalculator() {
  const [minutes, setMinutes] = useState(1);

  const pricePerMinute = 10;
  const total = minutes * pricePerMinute;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h3 className="text-xl font-bold text-white">
        Pricing Calculator
      </h3>

      <p className="mt-2 text-sm text-white/60">
        Estimate the cost of your dubbing project.
      </p>

      <div className="mt-5">
        <label className="text-sm text-white/70">
          Video duration (minutes)
        </label>

        <input
          type="number"
          min="1"
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
          className="mt-2 w-full rounded-lg border border-white/10 bg-black px-4 py-2 text-white"
        />
      </div>

      <div className="mt-5">
        <p className="text-sm text-white/60">
          Estimated price
        </p>

        <p className="mt-1 text-2xl font-bold text-white">
          ₹{total}
        </p>
      </div>
    </div>
  );
}