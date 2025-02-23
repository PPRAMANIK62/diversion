import { Toaster } from "@/components/browser/ui/toaster";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Srch",
  description: "Enhance Your Searching Experiences",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="relative flex min-h-screen flex-col justify-between overflow-x-hidden bg-black">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
