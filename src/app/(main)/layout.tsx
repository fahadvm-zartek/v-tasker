import AuthGate from '../../components/AuthGate';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <AuthGate>{children}</AuthGate>;
}
