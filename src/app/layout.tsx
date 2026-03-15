import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MediCare - Smart Medicine Reminder System",
  description: "AI-powered medicine reminder system with health tracking, emergency contacts, and intelligent health assistant.",
  keywords: ["MediCare", "Medicine Reminder", "Health", "AI Health Assistant", "Medicine Tracking"],
  authors: [{ name: "MediCare Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "MediCare - Smart Medicine Reminder",
    description: "Never miss a dose with AI-powered medicine reminders",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
