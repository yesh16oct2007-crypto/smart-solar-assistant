/**
 * Formatting utilities for Indian currency, metrics, and energy values.
 */

export function formatINR(val) {
  if (val === undefined || val === null || isNaN(val)) return "₹0";
  const num = Math.round(Number(val));
  // Indian numbering format (e.g., ₹ 1,50,000)
  return "₹" + num.toLocaleString("en-IN");
}

export function formatKWh(val) {
  if (val === undefined || val === null || isNaN(val)) return "0 kWh";
  return Number(val).toLocaleString("en-IN", { maximumFractionDigits: 1 }) + " kWh";
}

export function formatKW(val) {
  if (val === undefined || val === null || isNaN(val)) return "0 kW";
  return Number(val).toFixed(1) + " kW";
}

export function formatYears(val) {
  if (val === undefined || val === null || isNaN(val)) return "0 yrs";
  if (val > 50) return "50+ yrs";
  return Number(val).toFixed(1) + " Years";
}
