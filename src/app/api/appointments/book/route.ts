// ============================================================================
// File: src/app/api/appointments/book/route.ts
// Endpoint: POST /api/appointments/book
// Description: Concurrency-safe VIP reservation booking engine
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { AppointmentStatus, Role } from "@prisma/client";

// Strict input validation schema
const BookingRequestSchema = z.object({
  userId: z.string().cuid({ message: "Invalid client user ID format." }),
  serviceId: z.string().cuid({ message: "Invalid service ID format." }),
  artisanId: z.string().cuid({ message: "Invalid artisan ID format." }),
  startTime: z.string().datetime({ message: "Start time must be a valid ISO 8601 string." }),
  notes: z.string().max(1000).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parseResult = BookingRequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Validation Error",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { userId, serviceId, artisanId, startTime, notes } = parseResult.data;

    const requestedStart = new Date(startTime);
    const now = new Date();

    // Prevent bookings in the past
    if (requestedStart <= now) {
      return NextResponse.json(
        { error: "Appointments cannot be booked in the past." },
        { status: 400 }
      );
    }

    // 1. Verify Service exists & compute exact end_time
    const service = await prisma.service.findUnique({
      where: { id: serviceId, isActive: true },
      select: { id: true, name: true, durationMinutes: true, price: true },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Requested luxury service does not exist or is inactive." },
        { status: 404 }
      );
    }

    const requestedEnd = new Date(
      requestedStart.getTime() + service.durationMinutes * 60 * 1000
    );

    // 2. Verify Client and Artisan identities
    const [clientUser, artisanUser] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.user.findUnique({ where: { id: artisanId } }),
    ]);

    if (!clientUser) {
      return NextResponse.json({ error: "Client profile not found." }, { status: 404 });
    }

    if (!artisanUser || (artisanUser.role !== Role.MASTER_ARTISAN && artisanUser.role !== Role.DIRECTOR)) {
      return NextResponse.json(
        { error: "Selected specialist is not certified for Master appointments." },
        { status: 400 }
      );
    }

    // 3. Concurrency-Safe Transaction: Collision Check + Reservation Creation
    const newAppointment = await prisma.$transaction(async (tx) => {
      // Overlap condition:
      // An existing appointment conflicts if:
      // (existing.startTime < requestedEnd) AND (existing.endTime > requestedStart)
      // and status is not CANCELLED.
      const conflictingAppointment = await tx.appointment.findFirst({
        where: {
          artisanId: artisanId,
          status: {
            in: [AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING],
          },
          AND: [
            {
              startTime: {
                lt: requestedEnd,
              },
            },
            {
              endTime: {
                gt: requestedStart,
              },
            },
          ],
        },
        select: {
          id: true,
          startTime: true,
          endTime: true,
        },
      });

      if (conflictingAppointment) {
        throw new Error("ARTISAN_SLOT_CONFLICT");
      }

      // Check client schedule collision
      const clientConflict = await tx.appointment.findFirst({
        where: {
          userId: userId,
          status: {
            in: [AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING],
          },
          AND: [
            { startTime: { lt: requestedEnd } },
            { endTime: { gt: requestedStart } },
          ],
        },
      });

      if (clientConflict) {
        throw new Error("CLIENT_SLOT_CONFLICT");
      }

      // Create confirmed VIP appointment record
      return await tx.appointment.create({
        data: {
          userId,
          serviceId,
          artisanId,
          startTime: requestedStart,
          endTime: requestedEnd,
          notes,
          status: AppointmentStatus.CONFIRMED,
        },
        include: {
          service: {
            select: { name: true, durationMinutes: true, price: true },
          },
          artisan: {
            select: { id: true, name: true, email: true },
          },
        },
      });
    });

    return NextResponse.json(
      {
        message: "VIP Reservation confirmed successfully.",
        appointment: newAppointment,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.message === "ARTISAN_SLOT_CONFLICT") {
      return NextResponse.json(
        {
          error: "Conflict",
          message: "The requested Master Artisan is already engaged during this time slot.",
        },
        { status: 409 }
      );
    }

    if (error.message === "CLIENT_SLOT_CONFLICT") {
      return NextResponse.json(
        {
          error: "Conflict",
          message: "You already have another reservation scheduled during this time window.",
        },
        { status: 409 }
      );
    }

    console.error("[APPOINTMENT_BOOKING_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to process appointment." },
      { status: 500 }
    );
  }
}
