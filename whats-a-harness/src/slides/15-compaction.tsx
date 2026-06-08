import { motion, AnimatePresence } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

type Block =
  | { kind: 'turn'; role: 'user' | 'assistant' | 'tool'; weight: number; label: string }
  | { kind: 'summary'; label: string };

const TURNS: Block[] = [
  { kind: 'turn', role: 'user', weight: 1, label: 'план рефакторинга' },
  { kind: 'turn', role: 'assistant', weight: 2, label: 'план · 4 шага' },
  { kind: 'turn', role: 'tool', weight: 5, label: 'чтение 12 файлов' },
  { kind: 'turn', role: 'assistant', weight: 3, label: 'анализ' },
  { kind: 'turn', role: 'tool', weight: 6, label: 'grep вызовов' },
  { kind: 'turn', role: 'assistant', weight: 2, label: 'правки предложены' },
  { kind: 'turn', role: 'tool', weight: 8, label: 'правка 6 файлов' },
  { kind: 'turn', role: 'tool', weight: 4, label: 'прогон тестов' },
  { kind: 'turn', role: 'assistant', weight: 2, label: 'тесты прошли' },
  { kind: 'turn', role: 'user', weight: 1, label: 'теперь доки' },
  { kind: 'turn', role: 'assistant', weight: 2, label: 'черновик доков' },
];

const SUMMARY: Block = {
  kind: 'summary',
  label:
    'саммари · рефакторинг готов · 6 файлов изменено · тесты прошли · доки набросаны',
};

function colorFor(b: Block, dim: boolean) {
  if (b.kind === 'summary') {
    return dim ? 'rgba(123, 214, 195, 0.25)' : 'var(--cool)';
  }
  if (b.role === 'user') return dim ? 'rgba(174, 167, 152, 0.2)' : 'var(--ink-soft)';
  if (b.role === 'assistant') return dim ? 'rgba(255, 181, 71, 0.18)' : 'var(--accent)';
  return dim ? 'rgba(255, 181, 71, 0.1)' : 'rgba(255, 181, 71, 0.55)';
}

export const compactionSlide: Slide = {
  id: 'compaction',
  title: 'компакция',
  totalSteps: 4,
  render: ({ step }) => <CompactionSlide step={step} />,
};

function CompactionSlide({ step }: { step: number }) {
  const showHighlight = step >= 1;
  const showSummary = step >= 2;
  const showContinued = step >= 3;

  // Build the layout: full bar (step 0/1), highlight first half (1), replaced (2), continued (3+)
  const visibleTurns =
    step < 2
      ? TURNS
      : step === 2
      ? [SUMMARY, ...TURNS.slice(-4)]
      : [SUMMARY, ...TURNS.slice(-4), { kind: 'turn', role: 'assistant', weight: 3, label: 'дальше: план деплоя' } as Block];

  const totalWeight = visibleTurns.reduce(
    (s, b) => s + (b.kind === 'summary' ? 2 : b.weight),
    0
  );

  return (
    <Split
      ratio="1fr 1.2fr"
      left={
        <Stack gap={20}>
          <Eyebrow>память · 13</Eyebrow>
          <SlideTitle size="md">Контекст конечен. Компакция — это то, как он «прокручивается».</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>
                Каждый разговор живёт внутри контекстного окна модели — обычно 200k токенов у современных моделей. Каждая реплика, каждый результат инструмента, системный промпт — всё это считается.
              </BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>
                По мере роста разговора окно заполняется. Старые реплики вытесняются — и модели пришлось бы жёстко их забыть, без вариантов.
              </BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>
                Вместо этого harness просит саму модель <span style={{ color: 'var(--cool)' }}>пересказать</span> более старую часть. Саммари заменяет исходные реплики в контексте.
              </BodyText>
            </Build>
            <Build step={step} appearAt={3}>
              <BodyText>
                Теперь разговор продолжается. Недавние реплики остаются дословно; старые живут как компактное саммари, к которому модель может обращаться. Размен: точность потеряна, непрерывность сохранена.
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <Stack gap={20}>
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--ink-mute)',
            }}
          >
            контекстное окно
          </div>
          <div
            style={{
              width: '100%',
              border: '1px solid var(--line)',
              borderRadius: 6,
              overflow: 'hidden',
              background: 'var(--bg-elev)',
            }}
          >
            <div style={{ display: 'flex', height: 128, position: 'relative' }}>
              <AnimatePresence initial={false}>
                {visibleTurns.map((b, i) => {
                  const isOld = step === 1 && i < TURNS.length - 4;
                  const weight = b.kind === 'summary' ? 2 : b.weight;
                  return (
                    <motion.div
                      key={`${b.kind}-${b.label}-${i}`}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                      style={{
                        flex: `${weight} ${weight} 0`,
                        minWidth: 0,
                        overflow: 'hidden',
                        background: colorFor(b, !isOld && !showHighlight && b.kind !== 'summary'),
                        borderRight: '1px solid var(--bg-elev)',
                        outline: isOld ? '1.5px solid var(--accent)' : 'none',
                        outlineOffset: -1,
                        display: 'flex',
                        alignItems: 'flex-end',
                        padding: 6,
                        position: 'relative',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--mono)',
                          fontSize: 9.5,
                          color: b.kind === 'summary' ? 'var(--bg)' : 'var(--bg)',
                          opacity: 0.9,
                          letterSpacing: '0.04em',
                          lineHeight: 1.1,
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          width: '100%',
                        }}
                      >
                        {b.kind === 'summary' ? '∑ ' + b.label : b.label}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 14px',
                fontFamily: 'var(--mono)',
                fontSize: 11,
                color: 'var(--ink-mute)',
                borderTop: '1px solid var(--line)',
              }}
            >
              <span>
                {step < 2 ? `${TURNS.length} реплик · ~${totalWeight * 1500} токенов` : 'недавние реплики хранятся дословно'}
              </span>
              <span>лимит 200k</span>
            </div>
          </div>

          <Stack gap={6}>
            <Build step={step} appearAt={1}>
              <Caption color="var(--accent)">
                ↑ harness помечает старый блок как пригодный для компакции
              </Caption>
            </Build>
            <Build step={step} appearAt={2}>
              <Caption color="var(--cool)">
                ↑ блок-саммари заменяет исходные реплики
              </Caption>
            </Build>
            <Build step={step} appearAt={3}>
              <Caption color="var(--ink-soft)">
                ↑ разговор продолжается с большим запасом
              </Caption>
            </Build>
          </Stack>
          {/* prevent unused var warning when showContinued not directly used elsewhere */}
          {showContinued && null}
          {showSummary && null}
        </Stack>
      }
    />
  );
}

function Caption({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span
      style={{
        fontFamily: 'var(--mono)',
        fontSize: 11,
        color,
        letterSpacing: '0.06em',
      }}
    >
      {children}
    </span>
  );
}
