import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import { SITE } from "@/lib/contact";
import "./globals.css";

const sans = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const serif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: `${SITE.name} — Independent Hyderabad direction`,
  description:
    "Doctor's Credit is an independent Hyderabad care-direction service for patients in the US, Canada, Europe, New Zealand, and Australia. No hospital tie-ups. No commissions. Orientation is $5.",
  metadataBase: new URL("https://dcredit.in"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${serif.variable}`}>
        <Nav />
        {children}
        <Footer />
        <WhatsAppFab />
      </body>
    </html>
  );
}
