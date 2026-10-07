export const BILLING_CURRENCIES = [
  { code: "USD", label: "US dollar" },
  { code: "INR", label: "Indian rupee" },
  { code: "EUR", label: "Euro" },
  { code: "GBP", label: "British pound" },
  { code: "AUD", label: "Australian dollar" },
  { code: "CAD", label: "Canadian dollar" },
  { code: "NZD", label: "New Zealand dollar" },
  { code: "AED", label: "UAE dirham" },
  { code: "SAR", label: "Saudi riyal" },
  { code: "QAR", label: "Qatari riyal" },
  { code: "KWD", label: "Kuwaiti dinar" },
  { code: "OMR", label: "Omani rial" },
  { code: "BHD", label: "Bahraini dinar" },
  { code: "SGD", label: "Singapore dollar" },
  { code: "MYR", label: "Malaysian ringgit" },
  { code: "THB", label: "Thai baht" },
  { code: "JPY", label: "Japanese yen" },
  { code: "CNY", label: "Chinese yuan" },
  { code: "HKD", label: "Hong Kong dollar" },
  { code: "KRW", label: "South Korean won" },
  { code: "IDR", label: "Indonesian rupiah" },
  { code: "PHP", label: "Philippine peso" },
  { code: "CHF", label: "Swiss franc" },
  { code: "SEK", label: "Swedish krona" },
  { code: "NOK", label: "Norwegian krone" },
  { code: "DKK", label: "Danish krone" },
  { code: "ZAR", label: "South African rand" },
  { code: "NGN", label: "Nigerian naira" },
  { code: "KES", label: "Kenyan shilling" },
  { code: "BRL", label: "Brazilian real" },
  { code: "MXN", label: "Mexican peso" },
  { code: "PKR", label: "Pakistani rupee" },
  { code: "BDT", label: "Bangladeshi taka" },
] as const;

const CODES = new Set<string>(BILLING_CURRENCIES.map((item) => item.code));

/** Empty input defaults to USD. An unknown code is rejected. */
export function normalizeBillingCurrency(raw: unknown) {
  const code = String(raw ?? "")
    .trim()
    .toUpperCase();
  if (!code) return "USD";
  return CODES.has(code) ? code : null;
}
