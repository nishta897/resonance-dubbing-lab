import type { Metadata } from "next";
import { PolicyLayout } from "@/components/policy-layout";

export const metadata: Metadata = { title: "Terms and Conditions", description: "Terms governing use of Resonance Dubbing Lab." };

export default function TermsPage() {
  return <PolicyLayout title="Terms and conditions" summary="These terms govern your use of Resonance Dubbing Lab, a service operated by PRAGYASHAL PRIVATE LIMITED.">
    <h2>Using the service</h2><p>You must be legally able to enter into these terms and use the service only for lawful purposes. The product is provided as a guest-access demonstration unless a separate commercial agreement applies.</p>
    <h2>Your content and permissions</h2><p>You retain ownership of your content. You grant us the limited permission required to upload, process, transform, and deliver it. You confirm that you hold all necessary rights and consents for the media, speakers, languages, trademarks, and any requested voice cloning.</p>
    <h2>Acceptable use</h2><p>You may not use the service to impersonate people without authorization, create deceptive or harmful media, infringe intellectual-property or privacy rights, bypass security, disrupt the service, or violate applicable law.</p>
    <h2>Credits and third-party services</h2><p>Credits are consumed according to the estimate shown before processing. Dubbing relies on third-party infrastructure, including Sarvam AI, and may occasionally be delayed, unavailable, or produce results that require human review.</p>
    <h2>Intellectual property</h2><p>Resonance Dubbing Lab, its interface, branding, and underlying software are owned by or licensed to PRAGYASHAL PRIVATE LIMITED. These terms do not transfer ownership of the service to you.</p>
    <h2>Disclaimers and liability</h2><p>The service is provided on an “as available” basis. To the extent permitted by law, we disclaim implied warranties and are not liable for indirect, incidental, or consequential loss. Any aggregate liability is limited to the amount paid for the affected service.</p>
    <h2>Law and changes</h2><p>These terms are governed by the laws of India. We may update them when the product or applicable requirements change; continued use after an update means you accept the revised terms.</p>
  </PolicyLayout>;
}
