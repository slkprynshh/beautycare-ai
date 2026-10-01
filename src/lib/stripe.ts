// ============================================================================
// File: src/lib/stripe.ts
// Purpose: Stripe SDK Initialization with typed configuration
// ============================================================================

import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder_key", {
  apiVersion: "2024-06-20" as any,
  typescript: true,
});
