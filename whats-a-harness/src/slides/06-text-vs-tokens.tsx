import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Stack } from '../ui/Layout';

const SAMPLE = "I'm rebuilding the harness's tokenizer.";
// hand-illustrative chunks (real numbers come on slide 07)
const CHUNKS = [
  { text: 'I', id: 40 },
  { text: "'m", id: 1101 },
  { text: ' rebuilding', id: 24990 },
  { text: ' the', id: 279 },
  { text: ' harness', id: 31312 },
  { text: "'s", id: 596 },
  { text: ' token', id: 4037 },
  { text: 'izer', id: 3213 },
  { text: '.', id: 13 },
];

function visibleWS(s: string) {
  return s.replace(/ /g, '·');
}

export const textVsTokensSlide: Slide = {
  id: 'text-vs-tokens',
  title: 'текст vs токены',
  totalSteps: 3,
  render: ({ step }) => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 36 }}>
      <Stack gap={16}>
        <Eyebrow>вход · 05</Eyebrow>
        <SlideTitle>Модель видит не текст.</SlideTitle>
      </Stack>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
        <Stack gap={20}>
          <Build step={step} appearAt={0}>
            <BodyText>
              Для компьютера текст — это просто байты. Для LLM это <span style={{ color: 'var(--accent)' }}>токены</span> — куски, которые токенизатор выучил во время обучения.
            </BodyText>
          </Build>
          <Build step={step} appearAt={1}>
            <BodyText>
              У каждого токена есть целочисленный ID. Модель никогда не видит символы; она видит последовательность этих ID (а потом превращает их в векторы через эмбеддинг).
            </BodyText>
          </Build>
          <Build step={step} appearAt={2}>
            <BodyText>
              <span style={{ color: 'var(--ink)' }}>Токены — это не слова.</span> Это могут быть целые слова, части слов, отдельные символы или знаки препинания. Ведущие пробелы обычно входят в токен.
            </BodyText>
          </Build>
        </Stack>

        <Stack gap={28}>
          {/* text view */}
          <div>
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 10,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--ink-mute)',
                marginBottom: 12,
              }}
            >
              ты видишь это
            </div>
            <div
              style={{
                fontFamily: 'var(--display)',
                fontSize: 32,
                fontStyle: 'italic',
                color: 'var(--ink)',
                fontVariationSettings: "'opsz' 144, 'SOFT' 50",
              }}
            >
              {SAMPLE}
            </div>
          </div>

          {/* token view */}
          <Build step={step} appearAt={1}>
            <div>
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 10,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--accent)',
                  marginBottom: 12,
                }}
              >
                модель видит это
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {CHUNKS.map((c, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    style={{
                      padding: '6px 10px',
                      background: i % 2 === 0 ? 'var(--bg-elev)' : 'rgba(255,181,71,0.08)',
                      border: '1px solid var(--line)',
                      borderRadius: 4,
                      fontFamily: 'var(--mono)',
                      fontSize: 14,
                      color: 'var(--ink)',
                      whiteSpace: 'pre',
                    }}
                  >
                    <span>{visibleWS(c.text)}</span>
                    <span
                      style={{
                        display: 'block',
                        fontSize: 9,
                        color: 'var(--ink-mute)',
                        marginTop: 2,
                      }}
                    >
                      {c.id}
                    </span>
                  </motion.span>
                ))}
              </div>
            </div>
          </Build>
        </Stack>
      </div>
    </div>
  ),
};
