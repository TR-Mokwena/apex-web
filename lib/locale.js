"use client";

import { useState, useEffect } from "react";

// Money is stored in ZAR (base). Currency + number formatting follow the org's
// country. `rate` converts ZAR → that country's currency (approximate).
export const COUNTRIES = {
  "South Africa": { currency: "ZAR", symbol: "R", locale: "en-ZA", rate: 1 },
  Nigeria: { currency: "NGN", symbol: "₦", locale: "en-NG", rate: 85 },
  Kenya: { currency: "KES", symbol: "KSh ", locale: "en-KE", rate: 7 },
  "United Kingdom": { currency: "GBP", symbol: "£", locale: "en-GB", rate: 0.042 },
  "United States": { currency: "USD", symbol: "$", locale: "en-US", rate: 0.054 },
};
export const COUNTRY_LIST = Object.keys(COUNTRIES);
export const DEFAULT_COUNTRY = "South Africa";
export const COUNTRY_KEY = "apex-country";

const conf = (country) => COUNTRIES[country] || COUNTRIES[DEFAULT_COUNTRY];

export function getCountry() {
  if (typeof window === "undefined") return DEFAULT_COUNTRY;
  try { return localStorage.getItem(COUNTRY_KEY) || DEFAULT_COUNTRY; } catch { return DEFAULT_COUNTRY; }
}
export function saveCountry(country) {
  try { localStorage.setItem(COUNTRY_KEY, country); window.dispatchEvent(new Event("apex-country")); } catch {}
}

/** Format a count in the country's locale (e.g. en-ZA → "1 429"). */
export function formatNumber(n, country = DEFAULT_COUNTRY) {
  return new Intl.NumberFormat(conf(country).locale).format(n);
}
/** Format a ZAR-base amount into the country's currency. */
export function formatMoney(zar, country = DEFAULT_COUNTRY) {
  const c = conf(country);
  return c.symbol + new Intl.NumberFormat(c.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(zar * c.rate);
}
export const currencyConf = conf;

/** Reactive country — SSR-safe (defaults until mounted), updates on change. */
export function useCountry() {
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  useEffect(() => {
    setCountry(getCountry());
    const h = () => setCountry(getCountry());
    window.addEventListener("apex-country", h);
    return () => window.removeEventListener("apex-country", h);
  }, []);
  return country;
}
