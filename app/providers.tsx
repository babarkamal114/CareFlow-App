"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { useState, type ReactElement, type ReactNode } from "react";

import { Toaster, TooltipProvider } from "@/components/ui";
import { getQueryClient } from "lib";
import { SessionProvider } from "next-auth/react";

export function Providers({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
          <ReactQueryDevtools buttonPosition="bottom-left" initialIsOpen={false} />
        </QueryClientProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
