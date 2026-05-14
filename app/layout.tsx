import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-super-sans",
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: "Swofty",
  description:
    "Portfolio of Jacob 'Swofty' Nardella — Forward Deployed Engineer at Lyra. Previously infrastructure at Hypixel, Ceebs and Bathroom Superstore. Monash University CS student and competitive programmer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased text-ink page-rails">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
