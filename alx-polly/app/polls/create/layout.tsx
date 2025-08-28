import ProtectedRoute from '@/app/auth/components/protected-route';

export default function CreatePollLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}