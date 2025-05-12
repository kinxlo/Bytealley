import type { Metadata, Viewport } from "next";
import { Montserrat, Newsreader } from "next/font/google";

import "./globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";

import { GotoTop } from "~/components/miscellaneous/goto-top";
import { NetworkStatusModal } from "~/components/miscellaneous/network-error";
import { TooltipProvider } from "~/components/ui/tooltip";
import { LoadingProvider } from "~/context/loading-provider";
import { ProgressProviders } from "~/context/progress-provider";
import { ReactQueryProvider } from "~/context/react-query-provider";
import SessionProvider from "~/context/session-provider";
import ToastProvider from "~/context/toast-provider";
import NotificationProvider from "~/features/push-notification/context/notification-provider";
import { PageTransition } from "~/lib/animations";
import { ReduxProvider } from "~/store/provider";

// Configure fonts
const montserrat = Montserrat({ subsets: ["latin"], display: "swap" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", display: "swap" });

export const metadata: Metadata = {
  title: "Bytealley",
  description:
    "Monetize your skills with ease With ByteAlley, selling your products online is hassle-free. You can showcase your work and let us handle the backend tasks, allowing you to concentrate on what you do best.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 0.8,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} ${newsreader.variable}`}>
        <ReduxProvider>
          <LoadingProvider>
            <TooltipProvider>
              <SessionProvider>
                <NotificationProvider>
                  <ToastProvider>
                    <GotoTop />
                    <PageTransition>
                      <ProgressProviders>
                        <NetworkStatusModal />
                        <ReactQueryProvider>{children}</ReactQueryProvider>
                      </ProgressProviders>
                      <SpeedInsights />
                    </PageTransition>
                  </ToastProvider>
                </NotificationProvider>
              </SessionProvider>
            </TooltipProvider>
          </LoadingProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
