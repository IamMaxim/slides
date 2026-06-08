import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Stack } from '../ui/Layout';

type Cand = { text: string; p: number };

// Sequential distributions as we extend a prompt one token at a time.
const STAGES: { distribution: Cand[] }[] = [
  {
    distribution: [
      { text: ' mat', p: 0.41 },
      { text: ' rug', p: 0.21 },
      { text: ' floor', p: 0.12 },
      { text: ' couch', p: 0.08 },
      { text: ' bed', p: 0.06 },
      { text: ' chair', p: 0.04 },
      { text: ' step', p: 0.03 },
      { text: ' sofa', p: 0.03 },
      { text: ' …', p: 0.02 },
    ],
  },
  {
    distribution: [
      { text: '.', p: 0.46 },
      { text: ',', p: 0.18 },
      { text: ' and', p: 0.09 },
      { text: ' for', p: 0.06 },
      { text: ' looking', p: 0.05 },
      { text: ' while', p: 0.04 },
      { text: ' because', p: 0.04 },
      { text: ' staring', p: 0.03 },
      { text: ' …', p: 0.05 },
    ],
  },
  {
    distribution: [
      { text: ' The', p: 0.22 },
      { text: ' It', p: 0.18 },
      { text: ' Then', p: 0.12 },
      { text: ' Outside', p: 0.08 },
      { text: ' A', p: 0.07 },
      { text: ' Soon', p: 0.06 },
      { text: ' Suddenly', p: 0.05 },
      { text: ' Eventually', p: 0.04 },
      { text: ' …', p: 0.18 },
    ],
  },
];

function sample(dist: Cand[]) {
  const r = Math.random();
  let acc = 0;
  for (const c of dist) {
    acc += c.p;
    if (r <= acc) return c;
  }
  return dist[0];
}

export const nextTokenSlide: Slide = {
  id: 'next-token',
  title: 'что на самом деле делают LLM',
  totalSteps: 5,
  render: ({ step }) => <NextTokenSlide step={step} />,
};

function NextTokenSlide({ step }: { step: number }) {
  const [history, setHistory] = useState<string[]>([]);
  const stage = Math.min(history.length, STAGES.length - 1);
  const distribution = useMemo(() => STAGES[stage].distribution, [stage]);
  const prompt = 'The cat sat on the';

  const showDist = step >= 1;
  const showSample = step >= 2;
  const showAppend = step >= 3;
  const interactive = step >= 4;

  const [lastSampled, setLastSampled] = useState<string | null>(null);

  function roll() {
    const c = sample(distribution);
    setLastSampled(c.text);
    setHistory((h) => [...h, c.text]);
  }

  function reset() {
    setHistory([]);
    setLastSampled(null);
  }

  return (
    <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', height: '100%', gap: 24 }}>
      <Stack gap={12}>
        <Eyebrow>под капотом · 08</Eyebrow>
        <SlideTitle size="md">LLM — это предсказатель следующего токена в цикле.</SlideTitle>
      </Stack>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 48, alignItems: 'start' }}>
        <Stack gap={14}>
          <Build step={step} appearAt={0}>
            <BodyText>
              Дай модели промпт. Она вернёт распределение вероятностей по всему словарю — что должно идти дальше.
            </BodyText>
          </Build>
          <Build step={step} appearAt={1}>
            <BodyText>
              Мы <span style={{ color: 'var(--accent)' }}>сэмплируем</span> из этого распределения — выбираем один токен. Температура задаёт, насколько «острым» будет сэмплирование.
            </BodyText>
          </Build>
          <Build step={step} appearAt={2}>
            <BodyText>
              Дописываем выбранный токен к промпту.
            </BodyText>
          </Build>
          <Build step={step} appearAt={3}>
            <BodyText>
              Снова запускаем модель на новом, чуть более длинном промпте. Повторяем, пока не встретим стоп-токен.
            </BodyText>
          </Build>
          <Build step={step} appearAt={4}>
            <BodyText>
              <span style={{ color: 'var(--ink)' }}>Вот и всё.</span> Чат-боты, автодополнение кода, агенты — это всё тот же цикл, только с разными промптами и постобработкой сверху.
            </BodyText>
          </Build>
        </Stack>

        <Stack gap={20}>
          <div>
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 10,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--ink-mute)',
                marginBottom: 10,
              }}
            >
              промпт
            </div>
            <div
              style={{
                padding: 18,
                background: 'var(--bg-elev)',
                border: '1px solid var(--line)',
                borderRadius: 6,
                fontFamily: 'var(--mono)',
                fontSize: 16,
                color: 'var(--ink-soft)',
                minHeight: 56,
              }}
            >
              {prompt}
              <AnimatePresence>
                {history.map((t, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, backgroundColor: 'var(--accent-soft)' }}
                    animate={{
                      opacity: 1,
                      backgroundColor: 'rgba(0,0,0,0)',
                    }}
                    transition={{ duration: 0.6 }}
                    style={{
                      color: 'var(--accent)',
                      borderRadius: 3,
                      padding: '0 2px',
                    }}
                  >
                    {t}
                  </motion.span>
                ))}
              </AnimatePresence>
              <motion.span
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                style={{ color: 'var(--accent)' }}
              >
                ▍
              </motion.span>
            </div>
          </div>

          {showDist && (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 10,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--accent)',
                  }}
                >
                  p( следующий токен | промпт )
                </span>
                {interactive && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={roll}
                      style={{
                        background: 'var(--accent)',
                        color: 'var(--bg)',
                        border: 'none',
                        borderRadius: 4,
                        padding: '6px 14px',
                        fontFamily: 'var(--mono)',
                        fontSize: 11,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                      }}
                    >
                      сэмпл →
                    </button>
                    <button
                      onClick={reset}
                      style={{
                        background: 'transparent',
                        color: 'var(--ink-soft)',
                        border: '1px solid var(--line)',
                        borderRadius: 4,
                        padding: '6px 12px',
                        fontFamily: 'var(--mono)',
                        fontSize: 11,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}
                    >
                      сброс
                    </button>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {distribution.map((c) => {
                  const justSampled = showSample && lastSampled === c.text;
                  return (
                    <div
                      key={c.text}
                      style={{ display: 'grid', gridTemplateColumns: '80px 1fr 40px', alignItems: 'center', gap: 12 }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--mono)',
                          fontSize: 13,
                          color: justSampled ? 'var(--accent)' : 'var(--ink)',
                          whiteSpace: 'pre',
                        }}
                      >
                        {c.text.replace(/ /g, '·')}
                      </span>
                      <div
                        style={{
                          position: 'relative',
                          height: 10,
                          background: 'var(--line-soft)',
                          borderRadius: 2,
                          overflow: 'hidden',
                        }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${c.p * 220}%` }}
                          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          style={{
                            height: '100%',
                            background: justSampled ? 'var(--accent)' : 'var(--ink-mute)',
                            maxWidth: '100%',
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontFamily: 'var(--mono)',
                          fontSize: 11,
                          color: 'var(--ink-soft)',
                          textAlign: 'right',
                        }}
                      >
                        {(c.p * 100).toFixed(0)}%
                      </span>
                    </div>
                  );
                })}
              </div>
              {showAppend && !interactive && (
                <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-mute)', marginTop: 12 }}>
                  →  выбранный токен дописывается, и цикл продолжается.
                </p>
              )}
            </div>
          )}
        </Stack>
      </div>
    </div>
  );
}
