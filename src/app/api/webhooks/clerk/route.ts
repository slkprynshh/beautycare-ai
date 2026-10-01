// ============================================================================
// File: src/app/api/webhooks/clerk/route.ts
// Endpoint: POST /api/webhooks/clerk
// Description: Svix-verified webhook syncing Clerk users into PostgreSQL / Prisma
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

/**
 * Maps Clerk publicMetadata role string to Prisma Role Enum
 */
function mapClerkRoleToPrisma(role?: string): Role {
  if (!role) return Role.CLIENT;
  const normalized = role.toLowerCase().trim();

  switch (normalized) {
    case "director":
      return Role.DIRECTOR;
    case "artisan":
    case "master_artisan":
      return Role.MASTER_ARTISAN;
    case "client":
    default:
      return Role.CLIENT;
  }
}

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("[CLERK_WEBHOOK] CLERK_WEBHOOK_SECRET environment variable is missing.");
    return NextResponse.json(
      { error: "Server webhook configuration missing." },
      { status: 500 }
    );
  }

  // 1. Extract Svix Headers for verification
  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: "Missing required Svix verification headers." },
      { status: 400 }
    );
  }

  // 2. Read raw payload
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // 3. Cryptographically Verify Signature
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err: any) {
    console.error(`[CLERK_WEBHOOK] Signature verification failed: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook verification failed: ${err.message}` },
      { status: 400 }
    );
  }

  const eventType = evt.type;

  // 4. Handle User Created & User Updated
  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses, primary_email_address_id, first_name, last_name, phone_numbers, public_metadata } = evt.data;

    const primaryEmail = email_addresses?.find(
      (e) => e.id === primary_email_address_id
    )?.email_address || email_addresses?.[0]?.email_address;

    if (!primaryEmail) {
      console.warn(`[CLERK_WEBHOOK] User ${id} has no primary email. Skipping sync.`);
      return NextResponse.json({ received: true, skipped: "no_email" });
    }

    const fullName = [first_name, last_name].filter(Boolean).join(" ") || null;
    const phone = phone_numbers?.[0]?.phone_number || null;
    const roleString = (public_metadata as { role?: string })?.role;
    const mappedRole = mapClerkRoleToPrisma(roleString);

    try {
      // Upsert user into PostgreSQL
      const syncedUser = await prisma.user.upsert({
        where: { email: primaryEmail },
        update: {
          id: id,
          name: fullName,
          role: mappedRole,
          phone: phone,
        },
        create: {
          id: id,
          email: primaryEmail,
          name: fullName,
          role: mappedRole,
          phone: phone,
        },
      });

      return NextResponse.json({
        received: true,
        action: eventType,
        userId: syncedUser.id,
        role: syncedUser.role,
      });
    } catch (dbError: any) {
      console.error(`[CLERK_WEBHOOK_DATABASE_ERROR] Failed to sync user ${id}:`, dbError);
      return NextResponse.json(
        { error: "Database sync failed." },
        { status: 500 }
      );
    }
  }

  // 5. Handle User Deletion
  if (eventType === "user.deleted") {
    const { id } = evt.data;
    if (id) {
      try {
        await prisma.user.delete({
          where: { id },
        }).catch((err) => {
          // If already deleted or relation restriction, log gracefully
          console.warn(`[CLERK_WEBHOOK] User deletion handled for ${id}:`, err.message);
        });
      } catch (delError) {
        console.warn(`[CLERK_WEBHOOK] User deletion skipped for ${id}`);
      }
    }
    return NextResponse.json({ received: true, action: "user.deleted" });
  }

  return NextResponse.json({ received: true, status: "ignored_event" });
}
