'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Search, User, LogOut, Loader2, ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { libraryInfo } from '@/lib/content';
import { useSession } from '@/components/auth/useSession';
import { LogoutButton } from '@/components/auth/LogoutButton';

const mainNavItems = [
  { label: 'Home', href: '/' },
  { label: 'Catalog', href: '/catalog' },
  { label: 'Resources', href: '/resources' },
  { label: 'Research', href: '/research' },
  { label: 'Spaces', href: '/spaces' },
  { label: 'Events', href: '/events' },
  { label: 'About', href: '/about' },
];

const roleLabels: Record<string, string> = {
  STUDENT: 'Student',
  FACULTY: 'Faculty',
  LIBRARIAN: 'Librarian',
  ADMIN: 'Administrator',
};

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const isHome = pathname === '/';
  const { user, isLoading } = useSession();

  // Determine dashboard link based on role
  const dashboardHref =
    user?.role === 'LIBRARIAN'
      ? '/librarian'
      : user?.role === 'ADMIN'
        ? '/admin'
        : '/dashboard';

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300',
          isHome
            ? 'bg-background/70 backdrop-blur-xl border-b border-border/40'
            : 'bg-background/90 backdrop-blur-xl border-b border-border/60'
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo + Brand */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-primary">
              <Image
                src="/logo.svg"
                alt="COMSATS"
                width={22}
                height={22}
                className="object-contain brightness-0 invert"
              />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold leading-tight tracking-tight text-foreground">
                {libraryInfo.name}
              </p>
              <p className="text-[11px] leading-tight text-muted-foreground">
                {libraryInfo.title}
              </p>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            {mainNavItems.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150',
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  )}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-1 -bottom-px h-0.5 rounded-full bg-primary"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            <Link
              href="#homepage-search"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              aria-label="Search"
            >
              <Search className="size-[18px]" />
            </Link>

            {isLoading ? (
              /* Loading state */
              <div className="flex h-9 items-center px-2">
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              </div>
            ) : user ? (
              /* Authenticated: user menu */
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  onBlur={() => setTimeout(() => setUserMenuOpen(false), 200)}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors hover:bg-muted/60"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <User className="size-3.5" />
                  </div>
                  <span className="hidden sm:inline max-w-[140px] truncate">
                    {user.email.split('@')[0]}
                  </span>
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1 w-56 rounded-xl border border-border/70 bg-surface p-1.5 shadow-elevated z-50"
                    >
                      {/* User info */}
                      <div className="px-3 py-2.5 border-b border-border/50 mb-1">
                        <p className="text-sm font-medium text-foreground truncate">
                          {user.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {roleLabels[user.role] || user.role}
                        </p>
                      </div>

                      {/* Dashboard link */}
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          router.push(dashboardHref);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted/60"
                      >
                        <User className="size-4 text-muted-foreground" />
                        Dashboard
                      </button>

                      {/* Logout */}
                      <div className="border-t border-border/50 mt-1 pt-1">
                        <LogoutButton variant="ghost" size="sm" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Not authenticated: login button */
              <Link
                href="/login"
                className="hidden items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:inline-flex"
              >
                <User className="size-4" />
                <span>Login</span>
              </Link>
            )}

            <button
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-out menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed right-0 top-0 z-50 flex h-full w-80 max-w-[85vw] flex-col bg-surface shadow-2xl lg:hidden"
            >
              {/* Mobile header */}
              <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-primary">
                    <Image
                      src="/logo.svg"
                      alt="COMSATS"
                      width={18}
                      height={18}
                      className="object-contain brightness-0 invert"
                    />
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {libraryInfo.name}
                  </span>
                </div>
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/60"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Mobile nav links */}
              <div className="flex-1 overflow-y-auto px-3 py-4">
                <div className="space-y-1">
                  {mainNavItems.map((item) => {
                    const isActive =
                      item.href === '/'
                        ? pathname === '/'
                        : pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'flex items-center rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-primary/8 text-primary'
                            : 'text-foreground hover:bg-muted/60'
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>

                {/* Auth section in mobile menu */}
                <div className="mt-6 border-t border-border/50 pt-4">
                  {user ? (
                    <div className="space-y-1">
                      <div className="px-4 py-2">
                        <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                        <p className="text-xs text-muted-foreground">{roleLabels[user.role]}</p>
                      </div>
                      <button
                        onClick={() => {
                          setMobileOpen(false);
                          router.push(dashboardHref);
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/60"
                      >
                        <User className="size-4" /> Dashboard
                      </button>
                      <div
                        className="px-4"
                        onClick={() => setMobileOpen(false)}
                      >
                        <LogoutButton variant="ghost" size="sm" />
                      </div>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      <User className="size-4" />
                      <span>Login</span>
                    </Link>
                  )}
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
