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
    name: 'Conversation context',
    detail: 'The current chat history. The default "memory" inside one session.',
    scope: 'session',
    loaded: 'always',
    who: 'harness — auto',
    example: 'every prior turn, until compaction kicks in',
    color: 'var(--ink-soft)',
  },
  {
    name: 'Pinned project notes',
    detail: 'A small handful of always-loaded files: CLAUDE.md, AGENTS.md, repo conventions.',
    scope: 'persistent',
    loaded: 'every session',
    who: 'human — by hand',
    example: '"this repo uses pnpm and biome, never commit without running tests"',
    color: 'var(--accent)',
  },
  {
    name: 'Auto memory',
    detail: 'Per-fact files with short descriptions. Descriptions stay in prompt; bodies load on demand.',
    scope: 'persistent',
    loaded: 'description always · body on demand',
    who: 'agent — via remember tool',
    example: 'user_role.md, feedback_testing.md, indexed by MEMORY.md',
    color: 'var(--cool)',
  },
  {
    name: 'Scratchpad',
    detail: 'Temporary task-local notes the agent jots down while thinking. Discarded after.',
    scope: 'task',
    loaded: 'until task ends',
    who: 'agent — implicit',
    example: 'todo lists, intermediate plans, "things to check"',
    color: 'var(--ink-soft)',
  },
  {
    name: 'Vector / RAG',
    detail: 'A large corpus indexed by embedding. The agent queries it and the top hits are pulled in.',
    scope: 'persistent · large',
    loaded: 'on retrieval',
    who: 'pipeline — pre-ingested',
    example: 'all of last quarter’s incidents, every Notion page, the codebase',
    color: 'var(--accent)',
  },
];

export const memoryApproachesSlide: Slide = {
  id: 'memory-approaches',
  title: 'memory approaches',
  totalSteps: 1,
  render: () => (
    <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', height: '100%', gap: 14 }}>
      <Stack gap={6}>
        <Eyebrow>memory · 13c</Eyebrow>
        <SlideTitle size="sm">Five places agents keep things they shouldn’t forget.</SlideTitle>
        <BodyText size="sm">
          All of these are "memory" in casual conversation — but their scope and cost differ wildly. Most real systems combine several.
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
          <span>approach</span>
          <span>what it is</span>
          <span>scope</span>
          <span>when loaded</span>
          <span>maintained by</span>
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
                e.g. {r.example}
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
          <span style={{ color: 'var(--accent)' }}>tradeoffs.</span> Pinned notes are precise but don’t scale. Auto memory scales but the agent has to be disciplined about what to keep. Vector DBs scale further but cost recall — what you don’t retrieve, you don’t remember.
        </div>
      </div>
    </div>
  ),
};
