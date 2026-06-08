import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

// Same hand-tuned matrix as slide 08, with softmax-normalized rows for the deep view.
const SENTENCE = ['The', 'cat', 'sat', 'on', 'the', 'mat', 'because', 'it', 'was', 'tired'];
const RAW: number[][] = [
  [1.0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0.18, 1.0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0.06, 0.62, 1.0, 0, 0, 0, 0, 0, 0, 0],
  [0.04, 0.18, 0.74, 1.0, 0, 0, 0, 0, 0, 0],
  [0.05, 0.12, 0.22, 0.55, 1.0, 0, 0, 0, 0, 0],
  [0.04, 0.10, 0.18, 0.42, 0.65, 1.0, 0, 0, 0, 0],
  [0.03, 0.08, 0.14, 0.10, 0.06, 0.20, 1.0, 0, 0, 0],
  [0.04, 0.78, 0.10, 0.05, 0.04, 0.18, 0.32, 1.0, 0, 0],
  [0.02, 0.10, 0.18, 0.04, 0.04, 0.06, 0.10, 0.55, 1.0, 0],
  [0.04, 0.70, 0.18, 0.04, 0.04, 0.05, 0.20, 0.62, 0.45, 1.0],
];

// Row-normalize, treating zeros as -inf.
function softmaxRows(raw: number[][]) {
  return raw.map((row) =>
    row.map((v, j, arr) => {
      if (v === 0 && j >= arr.findIndex((x) => x > 0)) return 0;
      const max = Math.max(...row);
      const exps = row.map((x) => (x === 0 ? 0 : Math.exp((x - max) * 2)));
      const sum = exps.reduce((a, b) => a + b, 0);
      return v === 0 ? 0 : Math.exp((v - max) * 2) / sum;
    })
  );
}

const MAT = softmaxRows(RAW);

function Matrix({ step }: { step: number }) {
  const cell = 32;
  const N = SENTENCE.length;
  const size = N * cell;
  const margin = 60;

  return (
    <svg
      viewBox={`0 0 ${size + margin * 2} ${size + margin * 2}`}
      style={{ width: '100%', maxWidth: 560 }}
    >
      {/* axis labels - keys (columns) */}
      {SENTENCE.map((t, j) => (
        <text
          key={`k-${j}`}
          x={margin + j * cell + cell / 2}
          y={margin - 16}
          textAnchor="middle"
          fontSize="10"
          fontFamily="var(--mono)"
          fill={step >= 1 ? 'var(--cool)' : 'var(--ink-mute)'}
          transform={`rotate(-50, ${margin + j * cell + cell / 2}, ${margin - 16})`}
          style={{ transition: 'fill 300ms' }}
        >
          {t}
        </text>
      ))}
      {/* axis labels - queries (rows) */}
      {SENTENCE.map((t, i) => (
        <text
          key={`q-${i}`}
          x={margin - 8}
          y={margin + i * cell + cell / 2 + 4}
          textAnchor="end"
          fontSize="10"
          fontFamily="var(--mono)"
          fill={step >= 1 ? 'var(--accent)' : 'var(--ink-mute)'}
          style={{ transition: 'fill 300ms' }}
        >
          {t}
        </text>
      ))}

      {/* matrix cells */}
      {MAT.map((row, i) =>
        row.map((v, j) => {
          const masked = j > i;
          const showScores = step >= 1;
          const showSoftmax = step >= 2;
          const opacity = masked
            ? 0.05
            : showSoftmax
            ? Math.min(1, v * 1.4)
            : showScores
            ? Math.min(1, RAW[i][j] * 0.9)
            : 0.18;
          return (
            <motion.rect
              key={`${i}-${j}`}
              x={margin + j * cell + 1}
              y={margin + i * cell + 1}
              width={cell - 2}
              height={cell - 2}
              fill={masked ? 'var(--line-soft)' : 'var(--accent)'}
              initial={false}
              animate={{ opacity }}
              transition={{ duration: 0.35, delay: (i + j) * 0.01 }}
              rx={1}
            />
          );
        })
      )}

      {/* axis arrows */}
      <text
        x={margin + size / 2}
        y={margin - 38}
        textAnchor="middle"
        fontSize="10"
        fontFamily="var(--mono)"
        fill="var(--cool)"
        letterSpacing="0.12em"
        opacity={step >= 1 ? 1 : 0}
        style={{ transition: 'opacity 300ms' }}
      >
        KEYS  →
      </text>
      <text
        x={margin - 40}
        y={margin + size / 2}
        textAnchor="middle"
        fontSize="10"
        fontFamily="var(--mono)"
        fill="var(--accent)"
        letterSpacing="0.12em"
        opacity={step >= 1 ? 1 : 0}
        transform={`rotate(-90, ${margin - 40}, ${margin + size / 2})`}
        style={{ transition: 'opacity 300ms' }}
      >
        QUERIES  →
      </text>

      {/* V vectors hint */}
      {step >= 3 && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <text
            x={margin + size + 20}
            y={margin + 8 * cell + cell / 2 + 4}
            fontSize="10"
            fontFamily="var(--mono)"
            fill="var(--cool)"
            letterSpacing="0.1em"
          >
            × V → выход
          </text>
        </motion.g>
      )}
    </svg>
  );
}

export const attentionDeepSlide: Slide = {
  id: 'attention-deep',
  title: 'attention: глубже',
  totalSteps: 4,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.1fr"
      left={
        <Stack gap={20}>
          <Eyebrow>self-attention · 07b</Eyebrow>
          <SlideTitle size="md">Внутри коробки — крошечная система сопоставления.</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>
                Вектор каждого токена проецируется трижды, давая{' '}
                <span style={{ color: 'var(--accent)' }}>query</span>,{' '}
                <span style={{ color: 'var(--cool)' }}>key</span> и value.
                Думай так: «что я ищу», «что я предлагаю», «что я несу».
              </BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>
                Считаем скалярное произведение каждого query с каждым key. Яркие клетки = высокий счёт = хорошее совпадение.
                Клетки выше диагонали замаскированы — токены не могут видеть будущее.
              </BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>
                Применяем softmax построчно. Теперь каждая строка — это распределение вероятностей по key, то есть веса attention.
              </BodyText>
            </Build>
            <Build step={step} appearAt={3}>
              <BodyText>
                По этим весам берём взвешенную сумму векторов <span style={{ color: 'var(--cool)' }}>value</span>.
                Это и есть выход для каждого токена. Много голов делают это параллельно с разными проекциями.
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Matrix step={step} />
        </div>
      }
    />
  ),
};
