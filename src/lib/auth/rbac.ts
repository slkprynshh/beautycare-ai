// ============================================================================
// File: src/lib/auth/rbac.ts
// Purpose: Reusable API Handler Wrapper for Route-Level RBAC & Context Injection
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: Role;
}

type AuthenticatedHandler = (
  req: NextRequest,
  user: AuthenticatedUser
) => Promise<NextResponse> | NextResponse;

/**
 * Route-level defense-in-depth wrapper
 */
export function withRoleGuard(
  allowedRoles: Role[],
  handler: AuthenticatedHandler
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const userId = req.headers.get("x-user-id");
    const role = req.headers.get("x-user-role") as Role | null;
    const email = req.headers.get("x-user-email");

    if (!userId || !role || !email) {
      return NextResponse.json(
        { error: "Unauthorized", message: "User context not established." },
        { status: 401 }
      );
    }

    if (!allowedRoles.includes(role)) {
      return NextResponse.json(
        {
          error: "Forbidden",
          message: `Access denied. Requires one of roles: [${allowedRoles.join(", ")}]`,
        },
        { status: 403 }
      );
    }

    return handler(req, { userId, email, role });
  };
}
