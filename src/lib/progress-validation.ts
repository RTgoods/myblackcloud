// Level n requires n discharges (see startLevel()'s quota = n in game.js), so a full
// 8-level run tops out at 1+2+...+8 = 36 total discharges. The ceiling below is a
// generous bound against a hand-crafted request, not a tuned gameplay limit.
export const MAX_TOTAL_DISCHARGED = 50

export function isValidLevel(level: unknown): level is number {
  return Number.isInteger(level) && (level as number) >= 1 && (level as number) <= 8
}

export function isValidTotalDischarged(value: unknown): value is number {
  return Number.isInteger(value) && (value as number) >= 0 && (value as number) <= MAX_TOTAL_DISCHARGED
}

export function isValidDurationSeconds(value: unknown): value is number {
  return Number.isInteger(value) && (value as number) >= 0 && (value as number) <= 86_400
}

export function isValidCoinsEarned(value: unknown): value is number {
  return Number.isInteger(value) && (value as number) >= 0 && (value as number) <= 100_000
}

export function isValidFavoriteTools(value: unknown): value is { name: string; uses: number }[] {
  return Array.isArray(value) && value.length <= 3 && value.every((tool) =>
    typeof tool?.name === 'string' && tool.name.length > 0 && tool.name.length <= 40 &&
    Number.isInteger(tool.uses) && tool.uses > 0 && tool.uses <= 100_000
  )
}
