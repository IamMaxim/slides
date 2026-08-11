import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle } from '../ui/SlideTitle';
import { Stack, Row } from '../ui/Layout';

/** Deliberately the quietest slide in the act: no diagram, no motion loops.
 *  Four lines and one honest question, with room around them. */
const ITEMS = [
  { term: 'вкус', gloss: 'что считать хорошим' },
  { term: 'архитектура', gloss: 'какие границы провести' },
  { term: 'продукт', gloss: 'что вообще строить' },
  { term: 'содержимое линтеров', gloss: 'сами правила пишет команда' },
];

export const whatStaysHumanSlide: Slide = {
  id: 'what-stays-human',
  title: 'что остаётся человеку',
  totalSteps: 4,
  render: ({ step }) => (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Stack gap={0} style={{ width: '100%', maxWidth: 860 }}>
        <Eyebrow>агентная команда · 31</Eyebrow>
        <SlideTitle size="md">Что остаётся человеку</SlideTitle>

        <Stack gap={26} style={{ marginTop: 52 }}>
          {ITEMS.map((it, i) => (
            <Build key={it.term} step={step} appearAt={i} y={10} duration={0.5}>
              <Row gap={22} align="baseline">
                <span
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 12,
                    color: 'var(--accent)',
                    letterSpacing: '0.14em',
                    minWidth: 26,
                  }}
                >
                  0{i + 1}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--display)',
                    fontSize: 27,
                    fontWeight: 300,
                    letterSpacing: '-0.015em',
                    color: 'var(--ink)',
                  }}
                >
                  {it.term}
                </span>
                <span style={{ fontSize: 19, color: 'var(--ink-mute)' }}>—</span>
                <span style={{ fontSize: 19, color: 'var(--ink-soft)' }}>{it.gloss}</span>
              </Row>
            </Build>
          ))}
        </Stack>

        <Build step={step} appearAt={3} delay={0.55} duration={0.55} style={{ marginTop: 56 }}>
          <div
            style={{
              border: '1px dashed var(--line)',
              borderRadius: 6,
              padding: '22px 26px',
              maxWidth: 720,
            }}
          >
            <div
              style={{
                fontFamily: 'var(--display)',
                fontStyle: 'italic',
                fontSize: 21,
                lineHeight: 1.4,
                color: 'var(--ink)',
              }}
            >
              как растить джунов в команде, где типовую работу делает агент?
            </div>
            <div
              style={{
                marginTop: 12,
                fontFamily: 'var(--mono)',
                fontSize: 13,
                color: 'var(--accent)',
                letterSpacing: '0.02em',
              }}
            >
              честный ответ: индустрия ещё не знает
            </div>
          </div>
        </Build>
      </Stack>
    </div>
  ),
};
