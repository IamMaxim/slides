import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Stack } from '../ui/Layout';

type Row = {
  name: string;
  detail: string;
  scope: string;
  loaded: string;
  who: string;
  example: string;
  color: string;
};

const ROWS: Row[] = [
  {
    name: 'Контекст разговора',
    detail: 'Текущая история чата. «Память» по умолчанию внутри одной сессии.',
    scope: 'сессия',
    loaded: 'всегда',
    who: 'harness — авто',
    example: 'каждая предыдущая реплика, пока не сработает компакция',
    color: 'var(--ink-soft)',
  },
  {
    name: 'Закреплённые заметки проекта',
    detail: 'Небольшая горстка всегда загружаемых файлов: CLAUDE.md, AGENTS.md, соглашения репозитория.',
    scope: 'постоянная',
    loaded: 'каждую сессию',
    who: 'человек — вручную',
    example: '«этот репозиторий использует pnpm и biome, не коммить без прогона тестов»',
    color: 'var(--accent)',
  },
  {
    name: 'Авто-память',
    detail: 'Файлы по одному факту с короткими описаниями. Описания остаются в промпте; тела грузятся по запросу.',
    scope: 'постоянная',
    loaded: 'описание всегда · тело по запросу',
    who: 'агент — через инструмент remember',
    example: 'user_role.md, feedback_testing.md, индексируются MEMORY.md',
    color: 'var(--cool)',
  },
  {
    name: 'Черновик (scratchpad)',
    detail: 'Временные заметки в рамках задачи, которые агент набрасывает, пока думает. Потом выбрасываются.',
    scope: 'задача',
    loaded: 'до конца задачи',
    who: 'агент — неявно',
    example: 'todo-списки, промежуточные планы, «что проверить»',
    color: 'var(--ink-soft)',
  },
  {
    name: 'Vector / RAG',
    detail: 'Большой корпус, проиндексированный эмбеддингами. Агент делает запрос, и подтягиваются лучшие совпадения.',
    scope: 'постоянная · большая',
    loaded: 'при извлечении',
    who: 'пайплайн — заранее загружено',
    example: 'все инциденты за прошлый квартал, каждая страница Notion, кодовая база',
    color: 'var(--accent)',
  },
];

export const memoryApproachesSlide: Slide = {
  id: 'memory-approaches',
  title: 'подходы к памяти',
  totalSteps: 1,
  render: () => (
    <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', height: '100%', gap: 14 }}>
      <Stack gap={6}>
        <Eyebrow>память · 13c</Eyebrow>
        <SlideTitle size="sm">Пять мест, где агенты держат то, что не должны забыть.</SlideTitle>
        <BodyText size="sm">
          В разговорной речи всё это — «память», но область действия и цена сильно различаются. Большинство реальных систем сочетают несколько.
        </BodyText>
      </Stack>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 6,
          alignContent: 'start',
        }}
      >
        {/* header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '200px 1fr 130px 200px 160px',
            gap: 16,
            padding: '4px 14px',
            fontFamily: 'var(--mono)',
            fontSize: 9,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--ink-mute)',
          }}
        >
          <span>подход</span>
          <span>что это</span>
          <span>область</span>
          <span>когда грузится</span>
          <span>кто ведёт</span>
        </div>

        {ROWS.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            style={{
              display: 'grid',
              gridTemplateColumns: '200px 1fr 130px 200px 160px',
              gap: 16,
              padding: '8px 14px',
              background: 'var(--bg-elev)',
              border: '1px solid var(--line)',
              borderLeft: `3px solid ${r.color}`,
              borderRadius: 4,
              alignItems: 'start',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: 'var(--display)',
                  fontStyle: 'italic',
                  fontSize: 18,
                  color: r.color,
                  lineHeight: 1.1,
                  fontWeight: 300,
                }}
              >
                {r.name}
              </div>
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 9.5,
                  color: 'var(--ink-mute)',
                  marginTop: 3,
                  letterSpacing: '0.04em',
                  lineHeight: 1.35,
                }}
              >
                напр. {r.example}
              </div>
            </div>
            <div style={{ color: 'var(--ink-soft)', fontSize: 12.5, lineHeight: 1.4 }}>
              {r.detail}
            </div>
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 11,
                color: 'var(--ink)',
                letterSpacing: '0.04em',
              }}
            >
              {r.scope}
            </div>
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 11,
                color: 'var(--ink)',
                letterSpacing: '0.04em',
              }}
            >
              {r.loaded}
            </div>
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 11,
                color: 'var(--ink-soft)',
                letterSpacing: '0.04em',
              }}
            >
              {r.who}
            </div>
          </motion.div>
        ))}

        <div
          style={{
            marginTop: 6,
            padding: '9px 14px',
            border: '1px dashed var(--line)',
            borderRadius: 4,
            fontFamily: 'var(--mono)',
            fontSize: 11,
            color: 'var(--ink-mute)',
            lineHeight: 1.4,
          }}
        >
          <span style={{ color: 'var(--accent)' }}>компромиссы.</span> Закреплённые заметки точны, но не масштабируются. Авто-память масштабируется, но агент должен быть дисциплинирован в том, что хранить. Векторные БД масштабируются ещё дальше, но ценой recall — что не извлёк, того не помнишь.
        </div>
      </div>
    </div>
  ),
};
