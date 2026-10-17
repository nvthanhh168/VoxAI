import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VoxAI | Next-Gen AI English Learning Platform",
  description: "Master native English pronunciation, real-time AI speaking partner, and Spaced Repetition vocabulary that surpasses ELSA Speak.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
