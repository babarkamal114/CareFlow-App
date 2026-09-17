import "./globals.css";

import type { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "CareFlow",
  description: "UK home care agency operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="flex min-h-full flex-col bg-cf-surface text-cf-ink">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
