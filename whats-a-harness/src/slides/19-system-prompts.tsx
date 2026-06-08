import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

type Layer = {
  role: string;
  who: string;
  example: string;
  priority: number;
  color: string;
};

const LAYERS: Layer[] = [
  {
    role: 'system',
    who: 'задаётся провайдером ИИ (Anthropic, OpenAI)',
    example: '«Ты Claude, создан Anthropic. Будь полезным и безопасным…»',
    priority: 1,
    color: 'var(--ink-soft)',
  },
  {
    role: 'developer',
    who: 'задаётся harness\'ом или разработчиком приложения',
    example:
      '«Ты Claude Code. Используй TaskCreate для планирования многошаговой работы. Всегда читай файлы перед их редактированием…»',
    priority: 2,
    color: 'var(--accent)',
  },
  {
    role: 'user',
    who: 'тот, кто сейчас в чате',
    example: '«Отрефактори этот модуль, чтобы убрать устаревший API.»',
    priority: 3,
    color: 'var(--cool)',
  },
];

export const systemPromptsSlide: Slide = {
  id: 'system-prompts',
  title: 'системные промпты',
  totalSteps: 2,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.2fr"
      left={
        <Stack gap={20}>
          <Eyebrow>конфигурация · 14</Eyebrow>
          <SlideTitle size="md">Системные промпты — это слои инструкций в порядке приоритета.</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>
                Ещё до того, как пользователь что-либо напечатает, модель уже прочитала стопку инструкций: как себя вести, какие есть инструменты, каким соглашениям следовать.
              </BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>
                У этих слоёв есть неявный приоритет. При конфликте модель обучена следовать сначала более высокому слою — политики безопасности провайдера побеждают предпочтения твоего проекта, а те — спонтанный запрос пользователя.
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <Stack gap={14}>
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--ink-mute)',
            }}
          >
            приоритет — высший сверху
          </div>
          {LAYERS.map((l, i) => (
            <motion.div
              key={l.role}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.1 }}
              style={{
                position: 'relative',
                padding: '16px 18px 16px 60px',
                background: 'var(--bg-elev)',
                border: '1px solid var(--line)',
                borderLeft: `3px solid ${l.color}`,
                borderRadius: 4,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 16,
                  top: 18,
                  fontFamily: 'var(--display)',
                  fontStyle: 'italic',
                  fontSize: 28,
                  color: l.color,
                  fontWeight: 300,
                  lineHeight: 1,
                }}
              >
                {l.priority}
              </div>
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 10,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: l.color,
                  marginBottom: 4,
                }}
              >
                ⟨{l.role}⟩
              </div>
              <div style={{ color: 'var(--ink-mute)', fontSize: 12, marginBottom: 8 }}>{l.who}</div>
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 13,
                  color: 'var(--ink-soft)',
                  lineHeight: 1.5,
                }}
              >
                {l.example}
              </div>
            </motion.div>
          ))}
        </Stack>
      }
    />
  ),
};
