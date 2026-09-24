import type { Metadata } from "next";
import { PolicyLayout } from "@/components/policy-layout";

export const metadata: Metadata = { title: "No Refund Policy", description: "Credit and refund terms for Resonance Dubbing Lab." };

export default function RefundPolicyPage() {
  return <PolicyLayout title="No refund policy" summary="Credits and purchases for Resonance Dubbing Lab are generally final, subject to the limited exceptions below and applicable law.">
    <h2>Credits are non-refundable</h2><p>Once credits are added to a session or account, they cannot be exchanged for cash, transferred, or refunded for a change of mind. Promotional and complimentary credits have no cash value.</p>
    <h2>Failed processing</h2><p>If a dubbing job cannot be completed, the credits reserved for that job are automatically returned to your in-product balance. This is a credit reversal, not a cash refund.</p>
    <h2>Billing errors</h2><p>If you believe you were charged twice or a payment succeeded without credits being issued, contact the official support channel with the transaction details. Verified duplicate or failed technical charges will be reviewed and remedied as required.</p>
    <h2>Exceptions required by law</h2><p>Nothing in this policy limits consumer rights that cannot lawfully be excluded. Where applicable law requires a refund, PRAGYASHAL PRIVATE LIMITED will comply with that requirement.</p>
  </PolicyLayout>;
}
