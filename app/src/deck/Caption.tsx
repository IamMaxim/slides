type Props = {
  index: number;
  total: number;
  title: string;
};

export function Caption({ index, total, title }: Props) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 32,
        left: 40,
        display: 'flex',
        alignItems: 'baseline',
        gap: 16,
        fontFamily: 'var(--mono)',
        fontSize: 12,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--ink-mute)',
      }}
    >
      <span style={{ color: 'var(--accent)' }}>
        {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
      <span style={{ color: 'var(--ink-soft)' }}>{title}</span>
    </div>
  );
}
