import type { Metadata } from "next";
import { Caveat, Fraunces, Inter } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import CookieBanner from "@/components/CookieBanner";
import { SITE } from "@/lib/contact";
import { getSession } from "@/lib/session";
import "./globals.css";
import "./editorial.css";

const sans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const display = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const script = Caveat({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: `${SITE.name} | Explore Medical Care in India`,
  description:
    "Explore whether medical care in India may make sense for you. Learn about India's healthcare expertise, advanced technology, hospitals, treatment options, total journey costs and practical considerations.",
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
      <body id="top" className={`${sans.variable} ${display.variable} ${script.variable}`}>
        <p className="emergency-bar">
          DCredit does not handle medical emergencies. If you are in the United
          States, call 911. Otherwise seek immediate local emergency care.
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
