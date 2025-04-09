'use client';

import React, { PropsWithChildren, useEffect } from 'react';
import { useCurrentUser } from '@/modules/auth/model/use-get-current-user';
import { usePathname, useRouter } from 'next/navigation';
import { SidebarProvider } from '@/shared/ui/sidebar';
import Sidebar from '@/widgets/sidebar';

export const PrivateLayout = ({ children }: PropsWithChildren) => {
  const { data: user, isLoading, error } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && (!user || error)) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, isLoading, error, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">Loading...</div>
      </div>
    );
  }

  if (!user || error) {
    return null;
  }

  return (
    <SidebarProvider>
      <Sidebar />
      {children}
    </SidebarProvider>
  );
};
