import { Metadata } from 'next';
import VipPortalOverviewPage from '../page';

export const metadata: Metadata = {
  title: 'Executive VIP Dashboard | Villa Belladonna Milan',
  description:
    'Sovereign executive overview dashboard for VIP clients, Family Offices, and Executive Assistants at Villa Belladonna Milan.',
};

export default function VipDashboardPage() {
  return <VipPortalOverviewPage />;
}
