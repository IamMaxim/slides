import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

function MemoryDiagram({ step }: { step: number }) {
  // step 0: model + harness, nothing else
  // step 1: disk appears, remember() tool wired up
  // step 2: write happens (model → tool → disk)
  // step 3: new session: read happens (disk → harness → prompt → model)
  const W = 660;
  const H = 560;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 660 }}>
      <defs>
        <marker id="memarr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink-soft)" />
        </marker>
        <marker id="memarr-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
        </marker>
        <marker id="memarr-c" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--cool)" />
        </marker>
      </defs>

      {/* SESSION A (write) — top half */}
      <text
        x={26}
        y={26}
        fontSize="11"
        fontFamily="var(--mono)"
        fill="var(--ink-mute)"
        letterSpacing="0.18em"
      >
        SESSION A · write
      </text>
      <line x1={18} y1={34} x2={W - 18} y2={34} stroke="var(--line-soft)" />

      {/* model A */}
      <circle cx={92} cy={120} r={40} fill="var(--bg-elev)" stroke="var(--accent)" strokeWidth="1.6" />
      <text x={92} y={118} textAnchor="middle" fontFamily="var(--display)" fontStyle="italic" fontSize="17" fill="var(--accent)">
        model
      </text>
      <text x={92} y={136} textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill="var(--ink-mute)">
        stateless
      </text>

      {/* harness A */}
      <rect x={276} y={86} width={148} height={68} rx={4} fill="var(--bg-elev)" stroke="var(--line)" />
      <text x={350} y={118} textAnchor="middle" fontFamily="var(--display)" fontStyle="italic" fontSize="17" fill="var(--ink)">
        harness
      </text>
      <text x={350} y={137} textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill="var(--ink-mute)" letterSpacing="0.08em">
        executes tools
      </text>

      {/* disk */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 1 ? 1 : 0.18 }}
        transition={{ duration: 0.3 }}
      >
        <rect x={516} y={76} width={120} height={88} rx={3} fill="var(--bg-elev)" stroke="var(--cool)" strokeWidth="1.3" />
        <text x={576} y={102} textAnchor="middle" fontFamily="var(--mono)" fontSize="11" fill="var(--cool)" letterSpacing="0.14em">
          DISK
        </text>
        {/* fake file lines */}
        {[0, 1, 2].map((i) => (
          <line
            key={i}
            x1={530}
            y1={120 + i * 12}
            x2={622}
            y2={120 + i * 12}
            stroke="var(--cool)"
            strokeWidth="1"
            strokeOpacity={0.35}
          />
        ))}
      </motion.g>

      {/* model → harness (tool_use: remember) */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 2 ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <line x1={134} y1={120} x2={274} y2={120} stroke="var(--accent)" strokeWidth="1.5" markerEnd="url(#memarr-a)" />
        <text x={204} y={106} textAnchor="middle" fontSize="11" fontFamily="var(--mono)" fill="var(--accent)">
          remember("uses pnpm")
        </text>
      </motion.g>
      {/* harness → disk */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 2 ? 1 : 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <line x1={426} y1={120} x2={514} y2={120} stroke="var(--ink-soft)" strokeWidth="1.3" markerEnd="url(#memarr)" />
        <text x={470} y={106} textAnchor="middle" fontSize="11" fontFamily="var(--mono)" fill="var(--ink-soft)">
          fs.write
        </text>
      </motion.g>

      {/* divider */}
      <line x1={18} y1={252} x2={W - 18} y2={252} stroke="var(--line)" strokeDasharray="4 3" />

      {/* SESSION B (read) — bottom half */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 3 ? 1 : 0.18 }}
        transition={{ duration: 0.3 }}
      >
        <text
          x={26}
          y={286}
          fontSize="11"
          fontFamily="var(--mono)"
          fill="var(--ink-mute)"
          letterSpacing="0.18em"
        >
          SESSION B · read · later that week
        </text>
        <line x1={18} y1={294} x2={W - 18} y2={294} stroke="var(--line-soft)" />

        {/* disk again */}
        <rect x={24} y={344} width={120} height={88} rx={3} fill="var(--bg-elev)" stroke="var(--cool)" strokeWidth="1.3" />
        <text x={84} y={370} textAnchor="middle" fontFamily="var(--mono)" fontSize="11" fill="var(--cool)" letterSpacing="0.14em">
          DISK
        </text>
        {[0, 1, 2].map((i) => (
          <line
            key={i}
            x1={38}
            y1={388 + i * 12}
            x2={130}
            y2={388 + i * 12}
            stroke="var(--cool)"
            strokeWidth="1"
            strokeOpacity={0.35}
          />
        ))}

        {/* harness */}
        <rect x={246} y={354} width={148} height={68} rx={4} fill="var(--bg-elev)" stroke="var(--line)" />
        <text x={320} y={386} textAnchor="middle" fontFamily="var(--display)" fontStyle="italic" fontSize="17" fill="var(--ink)">
          harness
        </text>
        <text x={320} y={405} textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill="var(--ink-mute)" letterSpacing="0.08em">
          loads memory
        </text>

        {/* prompt */}
        <rect x={470} y={342} width={166} height={92} rx={3} fill="rgba(123, 214, 195, 0.10)" stroke="rgba(123, 214, 195, 0.4)" />
        <text x={553} y={368} textAnchor="middle" fontFamily="var(--mono)" fontSize="11" fill="var(--cool)" letterSpacing="0.14em">
          PROMPT
        </text>
        <text x={553} y={390} textAnchor="middle" fontFamily="var(--mono)" fontSize="11" fill="var(--ink-soft)">
          # memory
        </text>
        <text x={553} y={408} textAnchor="middle" fontFamily="var(--mono)" fontSize="11" fill="var(--ink-soft)">
          • uses pnpm
        </text>

        {/* disk → harness */}
        <line x1={146} y1={388} x2={244} y2={388} stroke="var(--cool)" strokeWidth="1.5" markerEnd="url(#memarr-c)" />
        <text x={195} y={374} textAnchor="middle" fontSize="11" fontFamily="var(--mono)" fill="var(--cool)">
          fs.read
        </text>
        {/* harness → prompt */}
        <line x1={396} y1={388} x2={468} y2={388} stroke="var(--ink-soft)" strokeWidth="1.3" markerEnd="url(#memarr)" />
        <text x={432} y={374} textAnchor="middle" fontSize="11" fontFamily="var(--mono)" fill="var(--ink-soft)">
          inject
        </text>

        {/* prompt → model */}
        <line x1={553} y1={434} x2={553} y2={478} stroke="var(--accent)" strokeWidth="1.5" markerEnd="url(#memarr-a)" />
        {/* new fresh model */}
        <circle cx={553} cy={508} r={30} fill="var(--bg-elev)" stroke="var(--accent)" strokeWidth="1.6" />
        <text x={553} y={512} textAnchor="middle" fontFamily="var(--mono)" fontSize="11" fill="var(--accent)">
          model
        </text>
        <text x={553} y={552} textAnchor="middle" fontFamily="var(--mono)" fontSize="10.5" fill="var(--ink-mute)" letterSpacing="0.06em">
          "knows" you use pnpm
        </text>
      </motion.g>
    </svg>
  );
}

export const memorySlide: Slide = {
  id: 'memory',
  title: 'how memory really works',
  totalSteps: 4,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.3fr"
      left={
        <Stack gap={20}>
          <Eyebrow>memory · 13b</Eyebrow>
          <SlideTitle size="md">"Memory" is just files. The agent takes notes.</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>
                So how do agents seem to remember things between sessions, then? They don’t — but the harness does, on the model’s behalf.
              </BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>
                The harness gives the model a <span style={{ color: 'var(--accent)' }}>remember</span> tool — just another tool, like read_file or web_search. Its job is to write a fact to a file on disk.
              </BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>
                When the model decides something is worth keeping — your name, your preferred build tool, a quirk of your codebase — it emits a tool_use. The harness writes it to disk. The model never touched the file system; it just produced text.
              </BodyText>
            </Build>
            <Build step={step} appearAt={3}>
              <BodyText>
                Next session, the harness reads the memory files first and pastes relevant entries into the system prompt. The fresh, stateless model now "remembers" — because it just read it for the first time.
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <MemoryDiagram step={step} />
        </div>
      }
    />
  ),
};
