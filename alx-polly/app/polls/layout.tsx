import ProtectedRoute from '@/app/auth/components/protected-route';

export default function PollsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}