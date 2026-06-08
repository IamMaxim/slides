import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

function LLMShape({ step }: { step: number }) {
  const W = 500;
  const H = 540;
  const cx = W / 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 560 }}>
      <defs>
        <marker
          id="larr"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink-soft)" />
        </marker>
      </defs>

      {/* embedding */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 0 ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <rect
          x={cx - 120}
          y={20}
          width={240}
          height={42}
          rx={5}
          fill="var(--accent-soft)"
          stroke="var(--accent-line)"
        />
        <text
          x={cx}
          y={42}
          textAnchor="middle"
          fontFamily="var(--display)"
          fontStyle="italic"
          fontSize="18"
          fill="var(--accent)"
        >
          эмбеддинг
        </text>
        <text
          x={cx}
          y={58}
          textAnchor="middle"
          fontSize="11.5"
          fontFamily="var(--mono)"
          fill="var(--ink-mute)"
        >
          id токена → вектор
        </text>
      </motion.g>

      {/* stack of blocks */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 1 ? 1 : 0.15 }}
        transition={{ duration: 0.3 }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.rect
            key={i}
            x={cx - 100}
            y={100 + i * 44}
            width={200}
            height={32}
            rx={3}
            fill="var(--bg-elev)"
            stroke="var(--line)"
            initial={false}
            animate={{ opacity: step >= 1 ? 1 : 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
          />
        ))}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <text
            key={`t-${i}`}
            x={cx}
            y={100 + i * 44 + 21}
            textAnchor="middle"
            fontSize="13"
            fontFamily="var(--mono)"
            fill="var(--ink-soft)"
            style={{ opacity: step >= 1 ? 1 : 0, transition: 'opacity 300ms' }}
          >
            блок {i + 1}
          </text>
        ))}
        <text
          x={cx + 124}
          y={100 + 3 * 44 + 22}
          fontSize="12.5"
          fontFamily="var(--mono)"
          fill="var(--ink-mute)"
          style={{ opacity: step >= 1 ? 1 : 0, transition: 'opacity 300ms' }}
        >
          × N
        </text>
        <text
          x={cx - 124}
          y={100 + 3 * 44 + 22}
          textAnchor="end"
          fontSize="11.5"
          fontFamily="var(--mono)"
          fill="var(--ink-mute)"
          style={{ opacity: step >= 1 ? 1 : 0, transition: 'opacity 300ms' }}
        >
          от десятков
          <tspan x={cx - 124} dy="13" textAnchor="end">до сотен</tspan>
        </text>
      </motion.g>

      {/* unembed */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 2 ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <rect
          x={cx - 120}
          y={380}
          width={240}
          height={42}
          rx={5}
          fill="rgba(123, 214, 195, 0.12)"
          stroke="rgba(123, 214, 195, 0.4)"
        />
        <text
          x={cx}
          y={402}
          textAnchor="middle"
          fontFamily="var(--display)"
          fontStyle="italic"
          fontSize="18"
          fill="var(--cool)"
        >
          unembedding
        </text>
        <text
          x={cx}
          y={418}
          textAnchor="middle"
          fontSize="11.5"
          fontFamily="var(--mono)"
          fill="var(--ink-mute)"
        >
          вектор → logits по словарю
        </text>
      </motion.g>

      {/* softmax distribution */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 3 ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        {[40, 25, 12, 8, 5, 4, 3, 2, 1].map((p, i) => (
          <rect
            key={i}
            x={cx - 100 + i * 23}
            y={510 - p * 1.6}
            width={18}
            height={p * 1.6}
            fill={i === 0 ? 'var(--accent)' : 'var(--line)'}
          />
        ))}
        <text
          x={cx}
          y={530}
          textAnchor="middle"
          fontSize="11.5"
          fontFamily="var(--mono)"
          fill="var(--ink-mute)"
          letterSpacing="0.1em"
        >
          вероятности следующего токена
        </text>
      </motion.g>

      {/* arrows */}
      {step >= 1 && (
        <line
          x1={cx}
          y1={62}
          x2={cx}
          y2={96}
          stroke="var(--ink-soft)"
          markerEnd="url(#larr)"
        />
      )}
      {step >= 2 && (
        <line
          x1={cx}
          y1={368}
          x2={cx}
          y2={380}
          stroke="var(--ink-soft)"
          markerEnd="url(#larr)"
        />
      )}
      {step >= 3 && (
        <line
          x1={cx}
          y1={422}
          x2={cx}
          y2={460}
          stroke="var(--ink-soft)"
          markerEnd="url(#larr)"
        />
      )}
    </svg>
  );
}

export const llmShapeSlide: Slide = {
  id: 'llm-shape',
  title: 'устройство LLM',
  totalSteps: 4,
  render: ({ step }) => (
    <Split
      ratio="1fr 1fr"
      left={
        <Stack gap={20}>
          <Eyebrow>вся картина целиком · 04</Eyebrow>
          <SlideTitle>LLM — это высокая стопка таких блоков.</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>
                На вход приходят id токенов. <span style={{ color: 'var(--accent)' }}>Эмбеддинг</span> превращает каждый в вектор.
              </BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>
                Эти векторы проходят через десятки — иногда сотни — блоков трансформера. Каждый блок чуть-чуть уточняет представления.
              </BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>
                Наверху <span style={{ color: 'var(--cool)' }}>unembedding</span> превращает финальные векторы в logits — по одному числу на каждый токен словаря.
              </BodyText>
            </Build>
            <Build step={step} appearAt={3}>
              <BodyText>
                Softmax превращает эти числа в вероятности. <span style={{ color: 'var(--ink)' }}>Это и есть вся модель.</span> Всё, что делает LLM, выходит из этой одной машины.
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LLMShape step={step} />
        </div>
      }
    />
  ),
};
