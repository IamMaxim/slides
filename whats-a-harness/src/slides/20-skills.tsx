import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

type Skill = {
  name: string;
  triggers: string;
  loaded: boolean;
};

const SKILLS: Skill[] = [
  { name: 'brainstorming', triggers: 'перед любой творческой работой', loaded: true },
  { name: 'debugging', triggers: 'перед исправлением бага', loaded: false },
  { name: 'test-driven-dev', triggers: 'перед написанием реализации', loaded: false },
  { name: 'frontend-design', triggers: 'при создании UI', loaded: true },
  { name: 'writing-plans', triggers: 'когда готова спецификация', loaded: false },
  { name: 'verify', triggers: 'перед заявлением о готовности', loaded: false },
  { name: 'huly', triggers: 'при работе с huly.app', loaded: false },
  { name: 'claude-api', triggers: 'в проектах на Anthropic SDK', loaded: false },
];

export const skillsSlide: Slide = {
  id: 'skills',
  title: 'скиллы',
  totalSteps: 3,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.2fr"
      left={
        <Stack gap={20}>
          <Eyebrow>конфигурация · 15</Eyebrow>
          <SlideTitle size="md">Скиллы: инструкции, которые модель грузит, когда они уместны.</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>
                Если вывалить модели всё, что ты знаешь, сразу — промпт раздувается, а attention размывается. Бо́льшая часть этих инструкций нужна лишь иногда.
              </BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>
                <span style={{ color: 'var(--accent)' }}>Скилл</span> — это небольшой именованный набор инструкций (а иногда и дополнительных инструментов или примеров) вместе с описанием того, когда его применять.
              </BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>
                Harness держит в промпте только описание; тело подгружается по запросу, когда модель решает, что скилл подходит к текущей задаче. Меньше мусора, больше возможностей.
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
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
            доступные скиллы
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SKILLS.map((s, i) => {
              const isLoaded = step >= 2 && s.loaded;
              return (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.04 * i }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '180px 1fr 80px',
                    alignItems: 'center',
                    gap: 16,
                    padding: '10px 14px',
                    background: isLoaded ? 'var(--accent-soft)' : 'var(--bg-elev)',
                    border: `1px solid ${isLoaded ? 'var(--accent-line)' : 'var(--line)'}`,
                    borderRadius: 4,
                    transition: 'background 300ms, border 300ms',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 13,
                      color: isLoaded ? 'var(--accent)' : 'var(--ink)',
                    }}
                  >
                    {s.name}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{s.triggers}</span>
                  <span
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 10,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: isLoaded ? 'var(--accent)' : 'var(--ink-mute)',
                      textAlign: 'right',
                    }}
                  >
                    {isLoaded ? '● loaded' : step >= 1 ? '○ idle' : '○ idle'}
                  </span>
                </motion.div>
              );
            })}
          </div>
          <Build step={step} appearAt={2}>
            <div
              style={{
                marginTop: 18,
                padding: '12px 14px',
                border: '1px dashed var(--accent-line)',
                borderRadius: 4,
                background: 'rgba(255, 181, 71, 0.06)',
                fontFamily: 'var(--mono)',
                fontSize: 12,
                color: 'var(--accent)',
              }}
            >
              # задача: «переделать оболочку колоды слайдов»
              <br />→ совпадает с <span style={{ color: 'var(--ink)' }}>brainstorming</span>,{' '}
              <span style={{ color: 'var(--ink)' }}>frontend-design</span>. Их полные тела загружаются в контекст.
            </div>
          </Build>
        </div>
      }
    />
  ),
};
