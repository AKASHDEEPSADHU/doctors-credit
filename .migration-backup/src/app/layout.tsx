import type { Metadata } from "next";
import { Caveat, Fraunces, Inter, Noto_Sans_Devanagari } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import CookieBanner from "@/components/CookieBanner";
import { LanguageProvider } from "@/components/LanguageProvider";
import LanguageSelector from "@/components/LanguageSelector";
import { languageMeta } from "@/lib/i18n/config";
import { getCommon } from "@/lib/i18n/server";
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

// Inter and Fraunces have no Devanagari glyphs; this keeps Hindi consistent
// across devices. Only downloaded when Hindi text is on the page.
const devanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: false,
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
  const { lang, t } = await getCommon();
  return (
    <html lang={languageMeta(lang).htmlLang}>
      <body
        id="top"
        className={`${sans.variable} ${display.variable} ${script.variable} ${devanagari.variable}`}
      >
        <LanguageProvider initialLang={lang}>
          <div className="topbar">
            <p className="emergency-bar">{t.emergencyBar}</p>
            <div className="topbar-lang">
              <LanguageSelector compact />
            </div>
          </div>
          <Nav signedIn={!!session} />
          {children}
          <Footer />
          <WhatsAppFab />
          <CookieBanner />
        </LanguageProvider>
      </body>
    </html>
  );
}
