// ============================================================================
// File: src/app/layout.tsx
// Description: Root Layout for Villa Belladonna Milan / VertOps
// ============================================================================

import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { ClientProviders } from '@/components/providers/ClientProviders';

export const metadata: Metadata = {
  title: 'Villa Belladonna Milan — Luxury Salon & Longevity Clinic',
  description: 'Milanese luxury beauty, bespoke skincare rituals, and clinical longevity aesthetics.',
};

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isClerkEnabled = Boolean(clerkKey && clerkKey.startsWith('pk_') && !clerkKey.includes('mock'));

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-gold/20 font-sans">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );

  if (isClerkEnabled) {
    return (
      <ClerkProvider publishableKey={clerkKey}>
        {content}
      </ClerkProvider>
    );
  }

  // Graceful fallback for local development before live keys are configured
  return content;
}
