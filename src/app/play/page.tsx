export const dynamic = 'force-dynamic'

// Keep in sync with EVENT_KINDS in public/game/assets/js/game.js.
const EVENT_KINDS = ['power', 'party', 'heyrt', 'clean', 'od', 'ortx', 'high', 'zomb', 'fire', 'bugs', 'fight', 'rant', 'niv']

function parseLevel(value: string | string[] | undefined): number {
  const n = Number(Array.isArray(value) ? value[0] : value)
  return Number.isInteger(n) && n >= 1 && n <= 8 ? n : 1
}

function parseEvent(value: string | string[] | undefined): string | null {
  const v = Array.isArray(value) ? value[0] : value
  return v && EVENT_KINDS.includes(v) ? v : null
}

export default async function PlayPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string | string[]; event?: string | string[] }>
}) {
  const params = await searchParams
  const level = parseLevel(params.level)
  const event = parseEvent(params.event)
  const src = `/game/index.html?level=${level}&embed=1${event ? `&event=${event}` : ''}`

  return (
    <div className="h-dvh w-full overflow-hidden bg-black">
      <iframe
        src={src}
        title="SHIFT"
        className="h-full w-full border-0"
        allow="autoplay"
      />
    </div>
  )
}
