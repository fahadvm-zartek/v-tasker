import { Header, OverviewDashboard, Sidebar } from './components';

export default function Dashboard() {
  return (
    <div className="app-shell flex min-h-screen bg-[#f7f8fa]">
      <Sidebar />
      <main className="dashboard-main flex-1 pl-[var(--layout-sidebar-current)] transition-[padding] duration-300 max-md:pl-0">
        <Header />
        <div className="dashboard-container px-8 pb-10 max-sm:px-4">
          <OverviewDashboard />
        </div>
      </main>
    </div>
  );
}
