import type { Metadata } from "next";
import { Inter, Playfair_Display, Space_Grotesk, Space_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

const playfairFont = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

const spaceGroteskFont = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const spaceMonoFont = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const jetbrainsMonoFont = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

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
      <body className={`${interFont.variable} ${playfairFont.variable} ${spaceGroteskFont.variable} ${spaceMonoFont.variable} ${jetbrainsMonoFont.variable} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
