import type { Metadata } from "next";
import { ThemeProvider } from "@/providers/theme-provider";
import { Navbar } from "@/components/utils/Navbar";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Code Weapon",
  description: "Your Ultimate Leetcode Companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased min-h-screen`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col w-full h-screen">
              <Navbar />
              {children}
              <Toaster />
            </div>
          </ThemeProvider>
      </body>
    </html>
  );
}
