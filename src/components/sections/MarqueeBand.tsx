export default function MarqueeBand() {
  const items = ['No Prompts Required', 'Upload & Analyze', 'Instant Output', 'Zero Learning Curve', 'Export Anywhere', 'Works for Everyone'];

  return (
    <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-1)', overflow: 'hidden', padding: '14px 0', position: 'relative' }}>
      <div className="marquee-track">
        {items.map((item, i) => (
          <span key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-3)', paddingRight: '64px', whiteSpace: 'nowrap' }}>
            {item} <span style={{ marginRight: '64px' }}>—</span>
          </span>
        ))}
        {items.map((item, i) => (
          <span key={`b${i}`} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-3)', paddingRight: '64px', whiteSpace: 'nowrap' }}>
            {item} <span style={{ marginRight: '64px' }}>—</span>
          </span>
        ))}
      </div>
    </div>
  );
}
