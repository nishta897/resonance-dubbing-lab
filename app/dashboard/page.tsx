import type { Metadata } from "next";
import { DashboardStudio } from "@/components/dashboard-studio";

export const metadata: Metadata = {
  title: "Dubbing Studio",
  description: "Upload and localize video into Indian languages with Resonance Dubbing Lab.",
};

export default function DashboardPage() {
  return <DashboardStudio />;
}
