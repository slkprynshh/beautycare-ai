// ============================================================================
// File: src/app/api/webhooks/stripe/route.ts
// Endpoint: POST /api/webhooks/stripe
// Description: Cryptographically verified Stripe webhook with atomic inventory decrement
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error("[STRIPE_WEBHOOK] Missing signature or STRIPE_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Webhook configuration error." },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  // 1. Verify Cryptographic Signature
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`[STRIPE_WEBHOOK] Signature verification failed: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Signature Verification Failed: ${err.message}` },
      { status: 400 }
    );
  }

  // 2. Handle Event Type
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const stripeSessionId = session.id;
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;

    try {
      // 3. Execute Transaction for Idempotent Order & Inventory Processing
      await prisma.$transaction(async (tx) => {
        // Find existing order via stripeSessionId
        const order = await tx.order.findUnique({
          where: { stripeSessionId },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        });

        if (!order) {
          throw new Error(`ORDER_NOT_FOUND:${stripeSessionId}`);
        }

        // Idempotency: If already paid, exit early
        if (order.status === OrderStatus.PAID) {
          return;
        }

        // Validate inventory and decrement stock safely
        for (const item of order.items) {
          const currentProduct = await tx.product.findUnique({
            where: { id: item.productId },
            select: { id: true, name: true, stockQuantity: true },
          });

          if (!currentProduct) {
            throw new Error(`PRODUCT_NOT_FOUND:${item.productId}`);
          }

          if (currentProduct.stockQuantity < item.quantity) {
            throw new Error(
              `INSUFFICIENT_STOCK:Product "${currentProduct.name}" only has ${currentProduct.stockQuantity} items left, requested ${item.quantity}.`
            );
          }

          // Atomic Stock Decrement
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stockQuantity: {
                decrement: item.quantity,
              },
            },
          });
        }

        // Mark Order as PAID and record payment intent ID
        await tx.order.update({
          where: { id: order.id },
          data: {
            status: OrderStatus.PAID,
            stripePaymentIntentId: paymentIntentId,
          },
        });
      });

      return NextResponse.json({ received: true, status: "order_fulfilled" });
    } catch (processError: any) {
      console.error("[STRIPE_WEBHOOK_TRANSACTION_FAILED]", processError);

      if (processError.message.startsWith("INSUFFICIENT_STOCK")) {
        // Record failure state in order
        await prisma.order.updateMany({
          where: { stripeSessionId },
          data: { status: OrderStatus.FAILED },
        });

        return NextResponse.json(
          { error: "Fulfillment failed due to inventory exhaustion." },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Order fulfillment failed." },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
