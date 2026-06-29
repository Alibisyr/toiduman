/**
 * Single source of truth for pricing, used across landing, pricing section
 * and the publish/checkout step.
 *
 * LAUNCH_PRICE is the headline; MARKET_PRICE is the (struck-through) anchor
 * labelled as the typical market price — we never name competitors.
 */
export const LAUNCH_PRICE = 990;
export const MARKET_PRICE = 5000;
export const CURRENCY = "₸";

export function formatPrice(value: number): string {
  return `${value.toLocaleString("ru-RU")} ${CURRENCY}`;
}
