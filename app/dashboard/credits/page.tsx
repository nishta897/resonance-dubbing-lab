import type { Metadata } from "next";
import { CreditUsage } from "@/components/credit-usage";

export const metadata: Metadata = { title: "Credit usage", description: "Review your Resonance Dubbing Lab credit activity." };
export default function CreditUsagePage() { return <CreditUsage />; }
