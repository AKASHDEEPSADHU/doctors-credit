import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import CookieBanner from "@/components/CookieBanner";
import { SITE } from "@/lib/contact";
import { getSession } from "@/lib/session";
import "./globals.css";

const sans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${SITE.name} — Know your options before you decide`,
  description:
    "DCredit is a US-focused planned-care decision and coordination platform helping US patients understand whether planned treatment in India may make sense. The $5 Initial Assessment is a conversation with DCredit — not a hospital, diagnosis or emergency service. No guaranteed savings or outcomes.",
  metadataBase: new URL("https://dcredit.in"),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  return (
    <html lang="en">
      <body id="top" className={sans.variable}>
        <p className="emergency-bar">
          DCredit does not handle medical emergencies. If you are experiencing an
          emergency, call 911 or seek immediate local emergency care.
        </p>
        <Nav signedIn={!!session} />
        {children}
        <Footer />
        <WhatsAppFab />
        <CookieBanner />
      </body>
    </html>
  );
}
