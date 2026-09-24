import type { Metadata } from "next";
import { PolicyLayout } from "@/components/policy-layout";

export const metadata: Metadata = { title: "Privacy Policy", description: "How Resonance Dubbing Lab handles account, media, and usage data." };

export default function PrivacyPolicyPage() {
  return <PolicyLayout title="Privacy policy" summary="This policy explains how PRAGYASHAL PRIVATE LIMITED handles information when you use Resonance Dubbing Lab.">
    <h2>Information we process</h2><p>We process a guest session identifier, credit balance, project settings, file metadata, usage records, and technical logs needed to operate and protect the service. We also process video and audio that you choose to upload.</p>
    <h2>How information is used</h2><p>Information is used to provide dubbing, estimate and record credit usage, display project status, troubleshoot failures, prevent abuse, and improve service reliability.</p>
    <h2>Media and service providers</h2><p>Uploaded media is sent to our dubbing infrastructure and Sarvam AI to create the requested output. Temporary local processing files are removed after a request completes or fails. Project metadata and credit records may be retained for service continuity and support.</p>
    <h2>Storage and security</h2><p>The demo stores a session identifier in your browser. We use reasonable technical and organizational safeguards, but no online system can guarantee absolute security. Do not upload confidential or regulated material unless you are authorized to do so.</p>
    <h2>Your choices</h2><p>You may stop using the service at any time and clear the site data stored by your browser. You may also contact the company through the official support channel published with the service to request access, correction, or deletion where applicable.</p>
    <h2>Children and updates</h2><p>The service is not directed to children under 18. We may update this policy as the product or legal requirements change; the effective date above identifies the latest version.</p>
  </PolicyLayout>;
}
