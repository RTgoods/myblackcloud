export const dynamic = 'force-dynamic'

function parseLevel(value: string | string[] | undefined): number {
  const n = Number(Array.isArray(value) ? value[0] : value)
  return Number.isInteger(n) && n >= 1 && n <= 8 ? n : 1
}

export default async function PlayPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string | string[] }>
}) {
  const level = parseLevel((await searchParams).level)

  return (
    <div className="h-screen w-full bg-black">
      <iframe
        src={`/game/index.html?level=${level}&embed=1`}
        title="SHIFT"
        className="h-full w-full border-0"
        allow="autoplay"
      />
    </div>
  )
}
