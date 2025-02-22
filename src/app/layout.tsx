import { ClerkProvider } from "@clerk/nextjs";
import { type Metadata } from "next";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "CazzAI",
  description: "Your Smartest Companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.className} bg-grid-white/[0.02] bg-black text-white antialiased`}
        >
          <NextThemeProvider attribute="class" defaultTheme="dark">
            {children}
          </NextThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
