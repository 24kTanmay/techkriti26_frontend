/**
 * fonts.ts — Font Loading Layer
 *
 * Single responsibility: load fonts and expose their CSS variable names.
 * This file has NO styling opinions — it simply makes fonts available
 * to the browser. Design token mapping lives in tokens.css.
 */

import {
    Playfair_Display,
    Space_Grotesk,
    JetBrains_Mono,
} from "next/font/google";

export const playfairFont = Playfair_Display({
    variable: "--font-playfair",
    subsets: ["latin"],
    weight: ["400", "600", "700"],
    style: ["normal", "italic"],
});

export const spaceGroteskFont = Space_Grotesk({
    variable: "--font-space-grotesk",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});

export const jetbrainsMonoFont = JetBrains_Mono({
    variable: "--font-jetbrains-mono",
    subsets: ["latin"],
    weight: ["400", "700"],
});

/**
 * Convenience array — spread into body className in layout.tsx:
 * <body className={`${fontClassNames} antialiased`}>
 */
export const fontClassNames = [
    playfairFont.variable,
    spaceGroteskFont.variable,
    jetbrainsMonoFont.variable,
].join(" ");
