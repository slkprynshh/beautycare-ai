import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      batchId = 'batch-neroli-8841',
      batchCode = 'NEROLI-VALDORCIA-2026-B4',
      quantityDeducted = 5.0,
      unit = 'ml',
      artisanName = 'Elena Russo',
      treatmentName = 'The Signature 24k Gold Bio-Peptide Facial',
      suite = 'Carrara Marble Suite I',
    } = body;

    const remainingMock = Math.max(0, 142.5 - quantityDeducted);
    const auditHash = crypto
      .createHash('sha256')
      .update(`${batchCode}:${quantityDeducted}:${remainingMock}:${artisanName}:${Date.now()}`)
      .digest('hex')
      .substring(0, 24);

    return NextResponse.json({
      success: true,
      message: `Successfully compounded and deducted ${quantityDeducted}${unit} from ${batchCode}.`,
      data: {
        batchCode,
        quantityDeducted,
        remainingQuantity: remainingMock,
        unit,
        artisanName,
        treatmentName,
        suite,
        auditHash: `SEAL-${auditHash.toUpperCase()}`,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Inventory Deduct API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process inventory deduction.' },
      { status: 500 }
    );
  }
}
