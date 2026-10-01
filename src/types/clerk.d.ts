// ============================================================================
// File: src/types/clerk.d.ts
// Purpose: Type-Safe Session Claim Extensions for Clerk RBAC
// ============================================================================

export type UserRole = "client" | "artisan" | "director";

declare global {
  interface CustomJwtSessionClaims {
    metadata?: {
      role?: UserRole;
    };
    role?: UserRole;
  }
}

declare module "svix" {
  export class Webhook {
    constructor(secret: string);
    verify(payload: string, headers: Record<string, string>): any;
  }
}

