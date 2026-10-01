import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      batchId = 'batch-01',
      batchCode = 'NEROLI-VALDORCIA-2026-B4',
      ingredientName = 'Tuscan Organic Neroli Cold-Pressed',
      terroirOrigin = "Val d'Orcia Organic Estate, Siena",
      quantity = 500,
      unit = 'ml',
    } = body;

    const orderRef = `HARVEST-ORD-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const estimatedArrival = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    return NextResponse.json({
      success: true,
      message: `Autonomous harvest mandate dispatched to ${terroirOrigin}.`,
      order: {
        orderReference: orderRef,
        ingredientName,
        batchCode,
        quantityOrdered: `${quantity} ${unit}`,
        supplierEstate: terroirOrigin,
        estimatedArrival,
        status: 'DISPATCHED_TO_ESTATE',
        coldChainTracking: 'ACTIVE_SENSOR_CRYO_4C',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Inventory Reorder API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to dispatch harvest restock mandate.' },
      { status: 500 }
    );
  }
}
