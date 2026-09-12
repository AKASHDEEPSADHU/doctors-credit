import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import { SITE } from "@/lib/contact";
import { getSession } from "@/lib/session";
import "./globals.css";

const sans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const serif = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: `${SITE.name} — Independent Hyderabad direction`,
  description:
    "Doctor's Credit is an independent Hyderabad care-direction service for patients in the US, Canada, Europe, New Zealand, and Australia. No hospital tie-ups. No commissions. Sign in with Google. Orientation is $5.",
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
      <body id="top" className={`${sans.variable} ${serif.variable}`}>
        <Nav signedIn={!!session} />
        {children}
        <Footer />
        <WhatsAppFab />
      </body>
    </html>
  );
}
