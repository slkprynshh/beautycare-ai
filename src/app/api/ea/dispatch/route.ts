import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      principalName = 'Anonymous Principal',
      discretionLevel = 'STRICT_NDA',
      eaName = 'Executive Assistant',
      eaPhone = '',
      eaEmail = '',
      corporateAccountCode = 'FO-MIL-8841',
      selectedTreatmentId = 'signature-facial',
      treatmentTitle = 'The Signature 24k Gold Bio-Peptide Facial',
      serviceTarmac = true,
      airportSelection = 'LIN',
      flightTailNumber = 'N784V',
      arrivalDate = new Date().toISOString().split('T')[0],
      arrivalTime = '14:00',
      suiteTemperature = 21.5,
      lightingMode = 'candlelight_1800k',
      specialInstructions = '',
    } = body;

    // Generate unique dispatch and pass tokens
    const dispatchId = `DISPATCH-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const passToken = `VB-PASS-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
    const securityHash = crypto
      .createHash('sha256')
      .update(`${dispatchId}:${principalName}:${passToken}:${arrivalDate}`)
      .digest('hex');

    // Assigned Suite & Master Artisan Allocation
    const suiteAllocations = [
      { suite: 'Carrara Marble Suite I', artisan: 'Elena Russo (Master Biologist)' },
      { suite: 'Palazzo Gold Suite II', artisan: 'Alessia V. (Lead Aesthetician)' },
      { suite: 'Botanical Courtyard Suite III', artisan: 'Chiara Belladonna (Longevity Director)' },
    ];
    const assigned = suiteAllocations[Math.floor(Math.random() * suiteAllocations.length)];

    const dispatchRecord = {
      dispatchId,
      passToken,
      securityHash: securityHash.substring(0, 32),
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
      principal: {
        pseudonym: discretionLevel === 'pseudonym' ? 'AURUM-9' : principalName,
        discretionLevel,
        corporateAccountCode,
      },
      coordinator: {
        eaName,
        eaPhone,
        eaEmail,
      },
      ceremony: {
        treatmentId: selectedTreatmentId,
        treatmentTitle,
        assignedSuite: assigned.suite,
        assignedArtisan: assigned.artisan,
        arrivalDate,
        arrivalTime,
      },
      logistics: {
        tarmacChauffeur: serviceTarmac,
        airport: airportSelection,
        flightTailNumber: flightTailNumber || 'Direct Ground Arrival',
      },
      ambience: {
        temperature: `${suiteTemperature}°C`,
        lighting: lightingMode === 'candlelight_1800k' ? '1800K Candlelight Amber' : '2700K Warm Palazzo Glow',
      },
      specialInstructions,
      passUrl: `/portal/pass/${passToken}`,
      qrPayload: JSON.stringify({
        vb_pass: passToken,
        dispatch: dispatchId,
        tier: 'SOVEREIGN_VIP',
        valid: arrivalDate,
      }),
    };

    return NextResponse.json(
      {
        success: true,
        message: 'VIP Family Office Dispatch protocol registered and secured.',
        data: dispatchRecord,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('EA Dispatch Route Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process dispatch protocol.',
        details: error?.message || 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
