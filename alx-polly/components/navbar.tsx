'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/app/auth/components/auth-provider';

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  // Check if the current path is active
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">Polly</Link>
          <nav className="hidden md:flex gap-6">
            <Link 
              href="/polls" 
              className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/polls') ? 'text-primary' : 'text-muted-foreground'}`}
            >
              Polls
            </Link>
            {user && (
              <Link 
                href="/polls/create" 
                className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/polls/create') ? 'text-primary' : 'text-muted-foreground'}`}
              >
                Create Poll
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground mr-2">
                {user.name || user.email}
              </span>
              <Button variant="ghost" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}