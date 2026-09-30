type Entry = { display_name: string; score: number; level_reached: number; created_at: string }

export function LeaderboardTable({ entries }: { entries: Entry[] }) {
  if (entries.length === 0) {
    return <p className="text-center text-sm" style={{ color: '#5C6D7A' }}>No shifts logged yet. Be the first.</p>
  }
  return (
    <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #1D2831' }}>
          <th className="py-2 pr-2 text-[11px] uppercase tracking-[1px]" style={{ color: '#C9A227' }}>#</th>
          <th className="py-2 pr-2 text-[11px] uppercase tracking-[1px]" style={{ color: '#C9A227' }}>Operator</th>
          <th className="py-2 pr-2 text-[11px] uppercase tracking-[1px]" style={{ color: '#C9A227' }}>Discharges</th>
          <th className="py-2 text-[11px] uppercase tracking-[1px]" style={{ color: '#C9A227' }}>Level reached</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry, i) => (
          <tr key={`${entry.display_name}-${entry.created_at}`} style={{ borderBottom: '1px solid #1D2831' }}>
            <td className="py-2 pr-2 text-sm" style={{ color: '#5C6D7A' }}>{i + 1}</td>
            <td className="py-2 pr-2 text-sm" style={{ color: '#D7E3EC' }}>{entry.display_name}</td>
            <td className="py-2 pr-2 text-sm" style={{ color: '#38D6E0' }}>{entry.score}</td>
            <td className="py-2 text-sm" style={{ color: '#D7E3EC' }}>{entry.level_reached} / 8</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
