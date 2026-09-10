import React from 'react';
import { DashboardPageShell } from './dashboard-ui';
import LockedOverlay from './LockedOverlay';

type DashboardPlaceholderPageProps = {
  title?: string;
};

const DashboardPlaceholderPage = ({ title = 'Dashboard' }: DashboardPlaceholderPageProps) => {
  return (
    <DashboardPageShell contentClassName="px-8 pb-6 pt-5 max-sm:px-4">
      <section className="relative min-h-[calc(100vh-134px)]" aria-label={`${title} coming soon`}>
        <LockedOverlay />
      </section>
    </DashboardPageShell>
  );
};

export default DashboardPlaceholderPage;
