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
      <head>
        {/* Suppress third-party browser extension content script errors */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                window.addEventListener('error', function(event) {
                  if (
                    (event.filename && (
                      event.filename.includes('chrome-extension:') ||
                      event.filename.includes('moz-extension:') ||
                      event.filename.includes('safari-extension:')
                    )) ||
                    (event.message && (
                      event.message.includes('M_ID') ||
                      event.message.includes('reading \\'M_ID\\'')
                    ))
                  ) {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                  }
                }, true);

                window.addEventListener('unhandledrejection', function(event) {
                  var reason = event.reason;
                  if (reason && reason.stack && (
                    reason.stack.includes('chrome-extension:') ||
                    reason.stack.includes('moz-extension:') ||
                    reason.stack.includes('M_ID')
                  )) {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                  }
                }, true);
              }
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
