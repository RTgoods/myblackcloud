// Fixed one-time unlock price. Override via NEXT_PUBLIC_GAME_PRICE_CENTS in
// Vercel env vars without a code change/redeploy of this file's default.
export const PRICE_CENTS = Number(process.env.NEXT_PUBLIC_GAME_PRICE_CENTS) || 900

export function formatPrice(cents: number = PRICE_CENTS): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`
}
