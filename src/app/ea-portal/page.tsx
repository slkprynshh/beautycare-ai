import { Metadata } from 'next';
import { EaDispatchPortal } from '@/components/belladonna/EaDispatchPortal';

export const metadata: Metadata = {
  title: 'Family Office & Executive Assistant Dispatch Protocol | Villa Belladonna Milan',
  description:
    'Dedicated high-discretion concierge and logistics dispatch portal for family offices, chiefs of staff, and executive assistants booking at Villa Belladonna Milan.',
};

export default function EaPortalPage() {
  return <EaDispatchPortal />;
}
