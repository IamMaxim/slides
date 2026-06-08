type Props = {
  step: number;
  total: number;
};

export function StepHint({ step, total }: Props) {
  const isLast = step >= total - 1;
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 32,
        right: 40,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        fontFamily: 'var(--mono)',
        fontSize: 11,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--ink-mute)',
      }}
    >
      <div style={{ display: 'flex', gap: 6 }}>
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            style={{
              width: 16,
              height: 2,
              background: i <= step ? 'var(--accent)' : 'var(--line)',
              transition: 'background 200ms ease',
            }}
          />
        ))}
      </div>
      <span style={{ opacity: isLast ? 0.45 : 1 }}>
        {isLast ? 'след. слайд →' : 'дальше →'}
      </span>
    </div>
  );
}
