import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      message = '',
      category = 'general',
      principal = 'AURUM-09',
      priority = 'high',
    } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Message content cannot be empty' },
        { status: 400 }
      );
    }

    const messageId = `MSG-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const timestamp = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    // Generate intelligent luxury concierge response based on keywords and context
    let conciergeResponse = "Buonasera. I have noted your request with the utmost discretion. The Master Suite concierge team has been briefed and will execute this seamlessly.";
    let actionConfirmed = 'Concierge Dispatch Logged';

    const lower = message.toLowerCase();
    if (lower.includes('chauffeur') || lower.includes('linate') || lower.includes('malpensa') || lower.includes('flight') || lower.includes('car')) {
      conciergeResponse = "Our private Maybach S-Class chauffeur (Marco T., Security Clearance Alpha) has been dispatched to meet your arrival at the private aviation terminal. Tarmac clearance ID: TARMAC-MIL-88.";
      actionConfirmed = 'Chauffeur & Tarmac Clearance Activated';
    } else if (lower.includes('champagne') || lower.includes('wine') || lower.includes('caviar') || lower.includes('drink') || lower.includes('dinner')) {
      conciergeResponse = "A chilled bottle of Dom Pérignon 2012 along with fresh Venetian caviar and Sicilian blood orange infused water will be prepared in your private suite prior to your arrival.";
      actionConfirmed = 'Sommelier & Palazzo Suite Service Prepared';
    } else if (lower.includes('gold') || lower.includes('facial') || lower.includes('skin') || lower.includes('treatment') || lower.includes('artisan')) {
      conciergeResponse = "Master Biologist Elena Russo has prepared the small-batch 24k gold colloidal serum in our compounding lab. Your suite is reserved for immediate private treatment.";
      actionConfirmed = 'Botanical Compounding Lab Allocated';
    } else if (lower.includes('temperature') || lower.includes('light') || lower.includes('music') || lower.includes('candle')) {
      conciergeResponse = "Suite climate controls have been calibrated to your exact specifications (21.5°C, 1800K warm amber candlelight, custom Italian cedarwood aromatherapy active).";
      actionConfirmed = 'Suite Environmental Calibration Confirmed';
    } else if (lower.includes('nda') || lower.includes('privacy') || lower.includes('security') || lower.includes('gate')) {
      conciergeResponse = "The mutual Sovereign NDA protocol is fully locked. Palazzo security will clear the private subterranean gate for direct zero-visibility suite entry.";
      actionConfirmed = 'Zero-Visibility Sovereign Security Cleared';
    }

    return NextResponse.json({
      success: true,
      messageId,
      timestamp,
      concierge: {
        name: 'Elena V.',
        title: 'Head of Sovereign Concierge & VIP Liaison',
        status: 'Online • Palazzo Milan',
        response: conciergeResponse,
        actionConfirmed,
      },
      audit: {
        encryption: 'AES-256-GCM',
        sha256Verification: crypto.createHash('sha256').update(message).digest('hex').substring(0, 16),
        whatsappSync: 'SYNCED_TO_DIRECTOR_SECURE_LINE',
      },
    });
  } catch (error: any) {
    console.error('Concierge API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to transmit concierge dispatch' },
      { status: 500 }
    );
  }
}
