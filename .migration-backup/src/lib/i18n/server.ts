import "server-only";
import { cookies } from "next/headers";
import { COMMON } from "./common";
import { DEFAULT_LANG, LANG_COOKIE, isLang, type Lang } from "./config";
import { PAGES } from "./pages";

/** Reads the `dc_lang` cookie. Reading cookies makes the route dynamic, which the root layout already is (session). */
export async function getLang(): Promise<Lang> {
  const jar = await cookies();
  const value = jar.get(LANG_COOKIE)?.value;
  return isLang(value) ? value : DEFAULT_LANG;
}

/** Shared strings (nav, cookie banner, WhatsApp, emergency bar) for Server Components. */
export async function getCommon() {
  const lang = await getLang();
  return { lang, t: COMMON[lang] };
}

/** Server-only page copy (footer, homepage) for Server Components. */
export async function getPages() {
  const lang = await getLang();
  return { lang, t: PAGES[lang] };
}
