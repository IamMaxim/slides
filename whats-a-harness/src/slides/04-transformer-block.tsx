import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

function TransformerBlock({ step }: { step: number }) {
  // step 0: tokens flow in
  // step 1: attention sublayer
  // step 2: feed-forward sublayer
  // step 3: residual
  // step 4: layer norm
  const W = 560;
  const H = 480;
  const blockW = 280;
  const blockX = (W - blockW) / 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 620 }}>
      <defs>
        <marker
          id="tarr"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink-soft)" />
        </marker>
      </defs>

      {/* tokens in */}
      <g>
        {[0, 1, 2, 3].map((i) => (
          <motion.rect
            key={i}
            x={blockX + 24 + i * 56}
            y={20}
            width="48"
            height="20"
            rx="3"
            fill="var(--bg-elev)"
            stroke="var(--line)"
            initial={false}
            animate={{ opacity: 1 }}
          />
        ))}
        <text
          x={W / 2}
          y={64}
          textAnchor="middle"
          fontSize="11.5"
          fontFamily="var(--mono)"
          fill="var(--ink-mute)"
          letterSpacing="0.1em"
        >
          векторы токенов на входе
        </text>
      </g>

      {/* main block frame */}
      <rect
        x={blockX}
        y={90}
        width={blockW}
        height={290}
        rx="6"
        fill="none"
        stroke="var(--line)"
        strokeDasharray="3 3"
      />
      <text
        x={blockX + blockW + 12}
        y={106}
        fontSize="10"
        fontFamily="var(--mono)"
        fill="var(--ink-mute)"
        letterSpacing="0.1em"
      >
        TRANSFORMER BLOCK
      </text>

      {/* Attention sublayer */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 1 ? 1 : 0.15 }}
        transition={{ duration: 0.3 }}
      >
        <rect
          x={blockX + 30}
          y={120}
          width={blockW - 60}
          height={56}
          rx="4"
          fill="var(--accent-soft)"
          stroke="var(--accent-line)"
        />
        <text
          x={W / 2}
          y={144}
          textAnchor="middle"
          fontFamily="var(--display)"
          fontStyle="italic"
          fontSize="17"
          fill="var(--accent)"
        >
          self-attention
        </text>
        <text
          x={W / 2}
          y={162}
          textAnchor="middle"
          fontSize="11.5"
          fontFamily="var(--mono)"
          fill="var(--ink-soft)"
        >
          токены смотрят друг на друга
        </text>
      </motion.g>

      {/* Feed-forward sublayer */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 2 ? 1 : 0.15 }}
        transition={{ duration: 0.3 }}
      >
        <rect
          x={blockX + 30}
          y={220}
          width={blockW - 60}
          height={56}
          rx="4"
          fill="rgba(123, 214, 195, 0.12)"
          stroke="rgba(123, 214, 195, 0.4)"
        />
        <text
          x={W / 2}
          y={244}
          textAnchor="middle"
          fontFamily="var(--display)"
          fontStyle="italic"
          fontSize="17"
          fill="var(--cool)"
        >
          feed-forward
        </text>
        <text
          x={W / 2}
          y={262}
          textAnchor="middle"
          fontSize="11.5"
          fontFamily="var(--mono)"
          fill="var(--ink-soft)"
        >
          MLP на каждый токен (крошечная сеть)
        </text>
      </motion.g>

      {/* Arrows between */}
      <line
        x1={W / 2}
        y1={50}
        x2={W / 2}
        y2={120}
        stroke="var(--ink-soft)"
        strokeWidth="1"
        markerEnd="url(#tarr)"
      />
      <line
        x1={W / 2}
        y1={176}
        x2={W / 2}
        y2={220}
        stroke="var(--ink-soft)"
        strokeWidth="1"
        markerEnd="url(#tarr)"
      />
      <line
        x1={W / 2}
        y1={276}
        x2={W / 2}
        y2={400}
        stroke="var(--ink-soft)"
        strokeWidth="1"
        markerEnd="url(#tarr)"
      />

      {/* Residual connections */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 3 ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <path
          d={`M ${W / 2} 60 Q ${blockX + blockW + 30} 60 ${blockX + blockW + 30} 148 Q ${blockX + blockW + 30} 200 ${W / 2} 200`}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
        <text
          x={blockX + blockW + 36}
          y={150}
          fontSize="11.5"
          fontFamily="var(--mono)"
          fill="var(--accent)"
          letterSpacing="0.1em"
        >
          + residual
        </text>
        <path
          d={`M ${W / 2} 200 Q ${blockX - 30} 200 ${blockX - 30} 250 Q ${blockX - 30} 300 ${W / 2} 300`}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
        <text
          x={blockX - 36}
          y={252}
          textAnchor="end"
          fontSize="11.5"
          fontFamily="var(--mono)"
          fill="var(--accent)"
          letterSpacing="0.1em"
        >
          + residual
        </text>
      </motion.g>

      {/* Layer norm tags */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 4 ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <text
          x={blockX + 36}
          y={114}
          fontSize="11.5"
          fontFamily="var(--mono)"
          fill="var(--ink-mute)"
        >
          ↓ layer-norm
        </text>
        <text
          x={blockX + 36}
          y={214}
          fontSize="11.5"
          fontFamily="var(--mono)"
          fill="var(--ink-mute)"
        >
          ↓ layer-norm
        </text>
      </motion.g>

      {/* tokens out */}
      <g>
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            x={blockX + 24 + i * 56}
            y={410}
            width="48"
            height="20"
            rx="3"
            fill="var(--bg-elev)"
            stroke="var(--accent)"
          />
        ))}
        <text
          x={W / 2}
          y={454}
          textAnchor="middle"
          fontSize="11.5"
          fontFamily="var(--mono)"
          fill="var(--ink-mute)"
          letterSpacing="0.1em"
        >
          обогащённые векторы токенов на выходе
        </text>
      </g>
    </svg>
  );
}

export const transformerBlockSlide: Slide = {
  id: 'transformer-block',
  title: 'блок трансформера',
  totalSteps: 5,
  render: ({ step }) => (
    <Split
      ratio="1fr 1fr"
      left={
        <Stack gap={20}>
          <Eyebrow>строительный блок · 03</Eyebrow>
          <SlideTitle>Блок трансформера — это две маленькие сети, склеенные вместе.</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={1}>
              <BodyText>
                <span style={{ color: 'var(--accent)' }}>Self-attention</span> позволяет каждому токену посмотреть на все остальные токены последовательности и подтянуть контекст.
                Подробнее — через пару слайдов.
              </BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>
                Затем крошечная <span style={{ color: 'var(--cool)' }}>feed-forward сеть</span> прогоняется по каждому токену независимо — это и есть та часть с «настоящими нейронами», которая делает тяжёлую нелинейную работу.
              </BodyText>
            </Build>
            <Build step={step} appearAt={3}>
              <BodyText>
                <span style={{ color: 'var(--accent)' }}>Residual-связи</span> добавляют вход обратно к выходу каждого подслоя. Именно они делают обучение глубоких стопок реальным.
              </BodyText>
            </Build>
            <Build step={step} appearAt={4}>
              <BodyText>
                Добавь сверху щепотку layer-norm, чтобы активации не разъезжались по масштабу — и всё: один блок трансформера готов.
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <TransformerBlock step={step} />
        </div>
      }
    />
  ),
};
