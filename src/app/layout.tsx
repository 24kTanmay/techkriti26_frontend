/**
 * layout.tsx — App Shell
 *
 * Responsibilities:
 *  - Import global styles
 *  - Apply font class names from fonts.ts (injects CSS variables into <body>)
 *  - Define page metadata
 *
 * Font loading logic lives in: src/styles/fonts.ts
 * Design tokens live in:       src/styles/tokens.css
 * Semantic aliases live in:    src/app/globals.css
 */

import type { Metadata } from "next";
import { fontClassNames } from "@/styles/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Neo-Nous Singularita | The Awakening",
  description: "A transcendent journey from biological micro-structures to cosmic macro-structures.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
          #spline-watermark { display: none !important; }
        `}</style>
      </head>
      <body className={`${fontClassNames} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
