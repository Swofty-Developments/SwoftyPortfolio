import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Swofty",
  description: "Portfolio of Swofty, a DevOps engineer and competitive programmer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
