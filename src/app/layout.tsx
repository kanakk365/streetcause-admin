import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/lib/theme-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Street Cause Admin",
  description: "Administrative dashboard for StreetCause - Manage community initiatives, volunteer coordination, and impact tracking for social change.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased`}
      >
        <ThemeProvider defaultTheme="light" storageKey="streetcause-ui-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
