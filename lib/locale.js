"use client";

import { useState, useEffect } from "react";

// Money is stored in ZAR (base). Currency + number formatting follow the org's
// country. `rate` converts ZAR → that country's currency (approximate).
// group/decimal separators are explicit so formatting is identical on server &
// client (avoids Intl ICU differences → hydration mismatches).
export const COUNTRIES = {
  "South Africa": { currency: "ZAR", symbol: "R", rate: 1, group: " ", decimal: "," },
  Nigeria: { currency: "NGN", symbol: "₦", rate: 85, group: ",", decimal: "." },
  Kenya: { currency: "KES", symbol: "KSh ", rate: 7, group: ",", decimal: "." },
  "United Kingdom": { currency: "GBP", symbol: "£", rate: 0.042, group: ",", decimal: "." },
  "United States": { currency: "USD", symbol: "$", rate: 0.054, group: ",", decimal: "." },
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

const group = (intStr, sep) => intStr.replace(/\B(?=(\d{3})+(?!\d))/g, sep);

/** Format a count in the country's number style (e.g. South Africa → "1 429"). */
export function formatNumber(n, country = DEFAULT_COUNTRY) {
  const c = conf(country);
  const neg = n < 0;
  return (neg ? "-" : "") + group(Math.round(Math.abs(n)).toString(), c.group);
}
/** Format a ZAR-base amount into the country's currency (e.g. "R31 567,50"). */
export function formatMoney(zar, country = DEFAULT_COUNTRY) {
  const c = conf(country);
  const v = zar * c.rate;
  const [int, dec] = Math.abs(v).toFixed(2).split(".");
  return (v < 0 ? "-" : "") + c.symbol + group(int, c.group) + c.decimal + dec;
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
