'use client';
import React, {PropsWithChildren} from 'react';
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/config/query-client";
import {Toaster} from "@/shared/ui/sonner";

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
};

export default Providers;