import React from 'react';
import Header from './Header';
import LockedOverlay from './LockedOverlay';
import Sidebar from './Sidebar';

type DashboardPlaceholderPageProps = {
  title?: string;
};

const DashboardPlaceholderPage = ({ title = 'Dashboard' }: DashboardPlaceholderPageProps) => {
  return (
    <div className="app-shell bg-[#f7f8fa]">
      <Sidebar />

      <main className="dashboard-main relative min-h-screen pl-[var(--layout-sidebar-current)] transition-[padding] duration-300 max-md:pl-0">
        <Header />

        <div className="dashboard-container px-8 pb-6 pt-5 max-sm:px-4">
          <section className="relative min-h-[calc(100vh-134px)]" aria-label={`${title} coming soon`}>
            <LockedOverlay />
          </section>
        </div>
      </main>
    </div>
  );
};

export default DashboardPlaceholderPage;
