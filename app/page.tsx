import { DashboardPageShell, OverviewDashboard } from './components';

export default function Dashboard() {
  return (
    <DashboardPageShell contentClassName="px-8 pb-10 pt-0 max-sm:px-4">
      <OverviewDashboard />
    </DashboardPageShell>
  );
}
