import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

// --- expert-grid geometry (illustrative; Qwen 3.5 really has 512 experts) ---
const COLS = 10;
const ROWS = 6;
const CELL = 13;
const GAP = 3;
const GRID_W = COLS * (CELL + GAP) - GAP;
const GRID_H = ROWS * (CELL + GAP) - GAP;

// lit expert indices per forward pass. index 0 = always-on shared expert.
// each run lights the shared expert + 10 routed experts = 11 of (10x6) shown.
const RUN_A = [0, 7, 13, 19, 24, 31, 36, 42, 48, 53, 58];
const RUN_B = [0, 4, 11, 16, 22, 29, 34, 39, 45, 50, 56];

function ExpertGrid({ lit }: { lit: number[] }) {
  const litSet = new Set(lit);
  return (
    <g>
      {Array.from({ length: COLS * ROWS }).map((_, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const isShared = i === 0;
        const isLit = litSet.has(i);
        return (
          <rect
            key={i}
            x={col * (CELL + GAP)}
            y={row * (CELL + GAP)}
            width={CELL}
            height={CELL}
            rx={2}
            fill={isShared ? 'var(--cool)' : isLit ? 'var(--accent)' : 'var(--bg-elev)'}
            stroke={isShared || isLit ? 'none' : 'var(--line)'}
          />
        );
      })}
    </g>
  );
}

function gridLabel(text: string, w: number) {
  return (
    <text
      x={w / 2}
      y={GRID_H + 16}
      textAnchor="middle"
      fontFamily="var(--mono)"
      fontSize="10"
      fill="var(--ink-mute)"
      letterSpacing="0.04em"
    >
      {text}
    </text>
  );
}

function ArchDiagram({ step }: { step: number }) {
  const W = 560;
  const H = 560;
  const cx = W / 2;
  const twoUp = step >= 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 560 }}>
      <defs>
        <marker
          id="arr2"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink-soft)" />
        </marker>
      </defs>

      {/* ---------- DENSE: Gemma 4 ---------- */}
      <text x={0} y={20} fontFamily="var(--mono)" fontSize="10" letterSpacing="0.18em" fill="var(--cool)">
        DENSE
      </text>
      <text x={W} y={20} textAnchor="end" fontFamily="var(--display)" fontStyle="italic" fontSize="18" fill="var(--cool)">
        Gemma 4
      </text>
      <rect x={cx - 150} y={34} width={300} height={56} rx={6} fill="rgba(123, 214, 195, 0.16)" stroke="var(--cool)" />
      <text x={cx} y={59} textAnchor="middle" fontFamily="var(--mono)" fontSize="13" fill="var(--cool)">
        one network — 31B
      </text>
      <text x={cx} y={77} textAnchor="middle" fontFamily="var(--mono)" fontSize="10.5" fill="var(--ink-mute)">
        every parameter fires, every token
      </text>

      {/* divider */}
      <line x1={40} y1={120} x2={W - 40} y2={120} stroke="var(--line)" />
      <rect x={cx - 16} y={111} width={32} height={18} rx={9} fill="var(--bg-elev)" stroke="var(--line)" />
      <text x={cx} y={124} textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill="var(--ink-mute)">
        vs
      </text>

      {/* ---------- SPARSE: Qwen 3.5 ---------- */}
      <text x={0} y={158} fontFamily="var(--mono)" fontSize="10" letterSpacing="0.18em" fill="var(--accent)">
        MIXTURE OF EXPERTS
      </text>
      <text x={W} y={158} textAnchor="end" fontFamily="var(--display)" fontStyle="italic" fontSize="18" fill="var(--accent)">
        Qwen 3.5
      </text>

      {/* router */}
      <rect x={cx - 50} y={176} width={100} height={30} rx={5} fill="var(--accent-soft)" stroke="var(--accent-line)" />
      <text x={cx} y={195} textAnchor="middle" fontFamily="var(--mono)" fontSize="12" fill="var(--accent)">
        router
      </text>

      {/* grids: one centered when step < 2, two side-by-side when step >= 2 */}
      {(() => {
        const gridY = 250;
        const singleX = cx - GRID_W / 2;
        const pairGap = 46;
        const leftX = cx - GRID_W - pairGap / 2;
        const rightX = cx + pairGap / 2;
        return (
          <>
            {/* run-1 grid (always present); slides left when the 2nd appears */}
            <motion.g
              initial={false}
              animate={{ x: twoUp ? leftX : singleX, y: gridY }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <ExpertGrid lit={RUN_A} />
              {twoUp && gridLabel('run 1', GRID_W)}
            </motion.g>

            {/* router -> run-1 arrow */}
            <line
              x1={cx}
              y1={206}
              x2={twoUp ? leftX + GRID_W / 2 : cx}
              y2={gridY - 6}
              stroke="var(--ink-soft)"
              markerEnd="url(#arr2)"
            />

            {/* run-2 grid (appears at step >= 2) */}
            <motion.g
              initial={false}
              animate={{ opacity: twoUp ? 1 : 0, x: rightX, y: gridY }}
              transition={{ duration: 0.4 }}
            >
              <ExpertGrid lit={RUN_B} />
              {gridLabel('run 2 · prompt reworded', GRID_W)}
            </motion.g>
            {twoUp && (
              <line
                x1={cx}
                y1={206}
                x2={rightX + GRID_W / 2}
                y2={gridY - 6}
                stroke="var(--ink-soft)"
                markerEnd="url(#arr2)"
              />
            )}
          </>
        );
      })()}

      {/* legend / active-params caption */}
      <text x={cx} y={400} textAnchor="middle" fontFamily="var(--mono)" fontSize="12" fill="var(--ink)">
        11 of 512 experts fire · 17B of 397B active
      </text>
      <g transform={`translate(${cx - 150}, 420)`}>
        <rect x={0} y={0} width={12} height={12} rx={2} fill="var(--cool)" />
        <text x={18} y={11} fontFamily="var(--mono)" fontSize="10.5" fill="var(--ink-mute)">
          shared (always on)
        </text>
        <rect x={150} y={0} width={12} height={12} rx={2} fill="var(--accent)" />
        <text x={168} y={11} fontFamily="var(--mono)" fontSize="10.5" fill="var(--ink-mute)">
          routed (picked per token)
        </text>
      </g>
      <text x={cx} y={462} textAnchor="middle" fontFamily="var(--mono)" fontSize="9.5" fill="var(--ink-mute)">
        grid is illustrative — Qwen 3.5 has 512 experts; ~11 fire per token
      </text>
      {step >= 2 && (
        <motion.text
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          x={cx}
          y={486}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="11"
          fill="var(--accent)"
        >
          same task → a different ~11 fire
        </motion.text>
      )}
    </svg>
  );
}

export const denseVsMoeSlide: Slide = {
  id: 'dense-vs-moe',
  title: 'dense vs moe',
  totalSteps: 5,
  render: ({ step }) => (
    <Split
      ratio="1fr 1fr"
      left={
        <Stack gap={18}>
          <Eyebrow>models · 16</Eyebrow>
          <SlideTitle size="md">A dense model uses all of itself. An MoE picks a committee — per token.</SlideTitle>
          <Stack gap={12} style={{ marginTop: 8 }}>
            <Build step={step} appearAt={0}>
              <BodyText size="sm">
                <span style={{ color: 'var(--cool)' }}>Gemma 4</span> is <strong>dense</strong>: all 31B
                parameters fire for every token. <span style={{ color: 'var(--accent)' }}>Qwen 3.5</span> is a{' '}
                <strong>mixture of experts</strong> — 397B parameters, but a router picks ~11 of 512 experts
                (<span style={{ color: 'var(--ink)' }}>17B</span>) per token.
              </BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText size="sm">
                <span style={{ color: 'var(--accent)' }}>Lever 1 · active compute.</span> You pay for — and
                "think with" — the <em>active</em> params. 17B is the real per-step budget: closer to a 17B model
                than a 397B one for any single step.
              </BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText size="sm">
                <span style={{ color: 'var(--accent)' }}>Lever 2 · routing is a roulette.</span> Reword a prompt,
                inject a skill, or just run again, and a different committee can pick up the task — up to a third of
                tokens reroute late in training, and picks can differ run-to-run. Steerability suffers.
              </BodyText>
            </Build>
            <Build step={step} appearAt={3}>
              <BodyText size="sm">
                <span style={{ color: 'var(--accent)' }}>Lever 3 · agentic RL is harder on MoE.</span> Agent skill
                comes from heavy RL post-training; on MoE the router drifts between training and inference, so that
                RL is harder to land. Frontier labs spend enormously to stabilize it.
              </BodyText>
            </Build>
            <Build step={step} appearAt={4}>
              <BodyText size="sm">
                <span style={{ color: 'var(--ink)' }}>Frontier models are MoE too</span> — DeepSeek, GLM, Kimi, and
                almost certainly GPT-5.5 &amp; Claude. The gap isn't sparse-vs-dense; it's active compute, routing
                stability, and agentic RL.
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ArchDiagram step={step} />
        </div>
      }
    />
  ),
};
