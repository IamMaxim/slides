type Props = {
  index: number;
  total: number;
};

export function ProgressBar({ index, total }: Props) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        background: 'var(--line-soft)',
      }}
    >
      <div
        style={{
          width: `${((index + 1) / total) * 100}%`,
          height: '100%',
          background: 'linear-gradient(90deg, var(--accent-line), var(--accent))',
          transition: 'width 400ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      />
    </div>
  );
}
