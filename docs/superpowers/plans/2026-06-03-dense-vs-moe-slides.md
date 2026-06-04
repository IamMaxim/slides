# Dense vs MoE Slides — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two slides to the LLM deck — a `dense-vs-moe` concept slide and a `model-zoo` comparison-table slide — placed between Skills and Recap, delivering a weighted understanding of why frontier (Claude/GPT) models are better agents and how open models can close the gap.

**Architecture:** Two new self-contained slide modules following existing deck patterns. `21-dense-vs-moe.tsx` uses the `Split` + `Build` pattern (like `05-llm-shape.tsx`) with a custom SVG diagram. `22-model-zoo.tsx` uses the staggered-rows table pattern (like `18-memory-approaches.tsx`). The recap file is renumbered and `index.ts` is rewired to include both new slides.

**Tech Stack:** Vite + React 19 + TypeScript + framer-motion. Existing primitives: `Split`, `Stack`, `Build`, `Eyebrow`, `SlideTitle`, `BodyText`. CSS vars only for color.

---

## Conventions for this plan (read first)

This repo has **no test framework** (no vitest/jest; `package.json` scripts are `dev`/`build`/`lint`/`preview`) and is **not under git**. Standard TDD-with-unit-tests and per-task `git commit` do not apply, and adding a test runner for two presentational SVG slides would be YAGNI against the existing pattern. We substitute an equivalent verification gate after each task:

- **Typecheck + build:** `cd /Users/maxim/work/slides/app && npm run build` (runs `tsc -b` then `vite build`). This catches missing exports, wrong prop types, and broken imports across the integration.
- **Lint:** `cd /Users/maxim/work/slides/app && npm run lint`.
- **Manual visual pass** (final task only): `npm run dev`, open the new slides, step through builds.

All file paths are absolute under `/Users/maxim/work/slides`.

---

## File structure

- **Create** `app/src/slides/21-dense-vs-moe.tsx` — exports `denseVsMoeSlide`. Owns the dense-vs-MoE SVG diagram + the 5-step text builds.
- **Create** `app/src/slides/22-model-zoo.tsx` — exports `modelZooSlide`. Owns the comparison table + bottom callout.
- **Rename** `app/src/slides/21-recap.tsx` → `app/src/slides/23-recap.tsx` — exported `recapSlide` and its `id: 'recap'` are unchanged; only the filename/position move. Also gains two recap tiles + an updated eyebrow number.
- **Modify** `app/src/slides/index.ts` — import the two new slides + the renamed recap; insert both between `skillsSlide` and `recapSlide`.

---

## Task 1: Create the `dense-vs-moe` slide

**Files:**
- Create: `app/src/slides/21-dense-vs-moe.tsx`

- [ ] **Step 1: Write the full slide module**

Create `app/src/slides/21-dense-vs-moe.tsx` with exactly this content:

```tsx
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
```

- [ ] **Step 2: Typecheck + build**

Run: `cd /Users/maxim/work/slides/app && npm run build`
Expected: exits 0 (no TS errors). The slide is not yet wired into `index.ts`, so it won't render anywhere yet — that's fine; this step only confirms the module type-checks and bundles.

- [ ] **Step 3: Lint**

Run: `cd /Users/maxim/work/slides/app && npm run lint`
Expected: exits 0 with no errors for `21-dense-vs-moe.tsx`.

---

## Task 2: Create the `model-zoo` slide

**Files:**
- Create: `app/src/slides/22-model-zoo.tsx`

- [ ] **Step 1: Write the full slide module**

Create `app/src/slides/22-model-zoo.tsx` with exactly this content:

```tsx
import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Stack } from '../ui/Layout';

type Row = {
  name: string;
  params: string;
  arch: string;
  agent: string;
  color: string;
  anchor?: boolean;
};

const ROWS: Row[] = [
  {
    name: 'Claude Opus 4.7',
    params: 'undisclosed*',
    arch: 'inferred MoE',
    agent: 'heavy agentic RL; very steerable across long tool loops',
    color: 'var(--ink-soft)',
  },
  {
    name: 'GPT-5.5',
    params: 'undisclosed*',
    arch: 'inferred MoE',
    agent: 'heavy agentic RL; very steerable',
    color: 'var(--ink-soft)',
  },
  {
    name: 'DeepSeek V4',
    params: '1.6T / 49B',
    arch: 'MoE',
    agent: 'big active budget; strongest open agent',
    color: 'var(--ink-soft)',
  },
  {
    name: 'GLM-5.1',
    params: '744B / 40B',
    arch: 'MoE',
    agent: 'strong open coding / agent model',
    color: 'var(--ink-soft)',
  },
  {
    name: 'Kimi K2.6',
    params: '1T / 32B',
    arch: 'MoE',
    agent: 'long-horizon agent focus',
    color: 'var(--ink-soft)',
  },
  {
    name: 'Qwen 3.5',
    params: '397B / 17B',
    arch: 'MoE · 512 experts',
    agent: 'huge knowledge, tiny active budget; strong but jumpy, hard to steer',
    color: 'var(--accent)',
    anchor: true,
  },
  {
    name: 'Llama 4',
    params: 'MoE (open)',
    arch: 'MoE',
    agent: 'open MoE; lighter agentic RL',
    color: 'var(--ink-soft)',
  },
  {
    name: 'Gemma 4',
    params: '31B / 31B',
    arch: 'dense',
    agent: 'small but fully predictable; every parameter fires',
    color: 'var(--cool)',
    anchor: true,
  },
];

const GRID = '210px 150px 190px 1fr';

export const modelZooSlide: Slide = {
  id: 'model-zoo',
  title: 'model zoo',
  totalSteps: 1,
  render: () => (
    <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', height: '100%', gap: 14 }}>
      <Stack gap={6}>
        <Eyebrow>models · 16a</Eyebrow>
        <SlideTitle size="sm">The 2026 model zoo, by what actually matters for agents.</SlideTitle>
        <BodyText size="sm">
          Almost everything at the frontier is MoE now — so "MoE vs dense" isn't the story. What separates great
          agents is active budget, routing stability, and how much agentic RL went in.
        </BodyText>
      </Stack>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 6, alignContent: 'start' }}>
        {/* header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: GRID,
            gap: 16,
            padding: '4px 14px',
            fontFamily: 'var(--mono)',
            fontSize: 9,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--ink-mute)',
          }}
        >
          <span>model</span>
          <span>total / active</span>
          <span>architecture</span>
          <span>as an agent</span>
        </div>

        {ROWS.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            style={{
              display: 'grid',
              gridTemplateColumns: GRID,
              gap: 16,
              padding: '8px 14px',
              background: r.anchor ? 'var(--accent-soft)' : 'var(--bg-elev)',
              border: '1px solid var(--line)',
              borderLeft: `3px solid ${r.anchor ? r.color : 'var(--line)'}`,
              borderRadius: 4,
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span
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
              </span>
              {r.anchor && (
                <span style={{ fontFamily: 'var(--mono)', fontSize: 8.5, color: 'var(--ink-mute)', letterSpacing: '0.08em' }}>
                  ◀ prev slide
                </span>
              )}
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--ink)', letterSpacing: '0.04em' }}>
              {r.params}
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--ink-soft)', letterSpacing: '0.04em' }}>
              {r.arch}
            </div>
            <div style={{ color: 'var(--ink-soft)', fontSize: 12.5, lineHeight: 1.4 }}>{r.agent}</div>
          </motion.div>
        ))}

        <div
          style={{
            marginTop: 6,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
          }}
        >
          <div
            style={{
              padding: '9px 14px',
              border: '1px dashed var(--line)',
              borderRadius: 4,
              fontFamily: 'var(--mono)',
              fontSize: 11,
              color: 'var(--ink-mute)',
              lineHeight: 1.45,
            }}
          >
            <span style={{ color: 'var(--accent)' }}>why Claude &amp; GPT win as agents.</span> Not because they're
            dense — almost certainly MoE too. A larger active budget + stabilized routing + vastly more agentic RL keep
            behavior consistent across reworded prompts, injected skills, and long tool loops.
          </div>
          <div
            style={{
              padding: '9px 14px',
              border: '1px dashed var(--line)',
              borderRadius: 4,
              fontFamily: 'var(--mono)',
              fontSize: 11,
              color: 'var(--ink-mute)',
              lineHeight: 1.45,
            }}
          >
            <span style={{ color: 'var(--cool)' }}>how open models close it.</span> Bigger active budgets or
            shared/always-on experts (less roulette), router stabilization (deterministic / distribution-based routing;
            align train- &amp; inference-time routers), and far more agentic RL — not more raw parameters.
          </div>
        </div>

        <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink-mute)', marginTop: 2, paddingLeft: 14 }}>
          *closed-weight internals aren't public — MoE is inferred, not confirmed.
        </div>
      </div>
    </div>
  ),
};
```

- [ ] **Step 2: Typecheck + build**

Run: `cd /Users/maxim/work/slides/app && npm run build`
Expected: exits 0 (no TS errors).

- [ ] **Step 3: Lint**

Run: `cd /Users/maxim/work/slides/app && npm run lint`
Expected: exits 0 with no errors for `22-model-zoo.tsx`.

---

## Task 3: Renumber recap and wire both slides into the deck

**Files:**
- Rename: `app/src/slides/21-recap.tsx` → `app/src/slides/23-recap.tsx`
- Modify: `app/src/slides/23-recap.tsx` (add two tiles + update eyebrow number)
- Modify: `app/src/slides/index.ts`

- [ ] **Step 1: Rename the recap file**

Run: `mv /Users/maxim/work/slides/app/src/slides/21-recap.tsx /Users/maxim/work/slides/app/src/slides/23-recap.tsx`
Expected: no output; `23-recap.tsx` now exists, `21-recap.tsx` no longer exists. (The exported `recapSlide` and its `id: 'recap'` are unchanged, so existing `#<n>/<step>` deep links by id keep working.)

- [ ] **Step 2: Add two recap tiles**

In `app/src/slides/23-recap.tsx`, the `TOPICS` array currently ends with the Skills entry:

```tsx
  { idx: 19, n: '18', t: 'Skills', sub: 'instructions loaded on demand' },
];
```

Replace that with (append the two new tiles before the closing bracket):

```tsx
  { idx: 19, n: '18', t: 'Skills', sub: 'instructions loaded on demand' },
  { idx: 20, n: '19', t: 'Dense vs MoE', sub: 'all params, or a committee per token' },
  { idx: 21, n: '20', t: 'Model zoo', sub: 'who steers well as an agent — and why' },
];
```

(`idx` is the 0-based deck position used in the URL hash; after Task 3 Step 4, dense-vs-moe is at index 20 and model-zoo at index 21. `n` is the recap's own display sequence, which runs 01–18 and now extends to 19–20.)

- [ ] **Step 3: Update the recap eyebrow number**

In `app/src/slides/23-recap.tsx`, change:

```tsx
        <Eyebrow>thank you · 19</Eyebrow>
```

to:

```tsx
        <Eyebrow>thank you · 21</Eyebrow>
```

- [ ] **Step 4: Rewire `index.ts`**

Replace the entire contents of `app/src/slides/index.ts` with:

```ts
import type { Slide } from '../deck/types';
import { titleSlide } from './01-title';
import { neuronSlide } from './02-neuron';
import { networkSlide } from './03-network';
import { transformerBlockSlide } from './04-transformer-block';
import { llmShapeSlide } from './05-llm-shape';
import { textVsTokensSlide } from './06-text-vs-tokens';
import { tokenizerSlide } from './07-tokenizer';
import { attentionIntuitionSlide } from './08-attention-intuition';
import { attentionDeepSlide } from './09-attention-deep';
import { nextTokenSlide } from './10-next-token';
import { chatSlide } from './11-chat';
import { toolsSlide } from './12-tools';
import { agentLoopSlide } from './13-agent-loop';
import { harnessSlide } from './14-harness';
import { compactionSlide } from './15-compaction';
import { noLearningSlide } from './16-no-learning';
import { memorySlide } from './17-memory';
import { memoryApproachesSlide } from './18-memory-approaches';
import { systemPromptsSlide } from './19-system-prompts';
import { skillsSlide } from './20-skills';
import { denseVsMoeSlide } from './21-dense-vs-moe';
import { modelZooSlide } from './22-model-zoo';
import { recapSlide } from './23-recap';

export const slides: Slide[] = [
  titleSlide,
  neuronSlide,
  networkSlide,
  transformerBlockSlide,
  llmShapeSlide,
  textVsTokensSlide,
  tokenizerSlide,
  attentionIntuitionSlide,
  attentionDeepSlide,
  nextTokenSlide,
  chatSlide,
  toolsSlide,
  agentLoopSlide,
  harnessSlide,
  compactionSlide,
  noLearningSlide,
  memorySlide,
  memoryApproachesSlide,
  systemPromptsSlide,
  skillsSlide,
  denseVsMoeSlide,
  modelZooSlide,
  recapSlide,
];
```

- [ ] **Step 5: Typecheck + build**

Run: `cd /Users/maxim/work/slides/app && npm run build`
Expected: exits 0. This confirms the renamed import resolves, both new slides export the expected symbols, and the array type-checks.

- [ ] **Step 6: Lint**

Run: `cd /Users/maxim/work/slides/app && npm run lint`
Expected: exits 0.

---

## Task 4: Manual visual verification

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

Run: `cd /Users/maxim/work/slides/app && npm run dev`
Expected: Vite prints a Local URL (e.g. `http://localhost:5173`).

- [ ] **Step 2: Verify slide 21 (`dense-vs-moe`)**

Open `http://localhost:5173/#20/0` (deck position 20). Confirm:
- Eyebrow reads `models · 16`; title and the dense (Gemma 4) block + MoE (Qwen 3.5) router/grid render.
- Pressing `→` reveals the five text builds in order (intro → Lever 1 → Lever 2 → Lever 3 → closer).
- At Lever 2 (step 2) the single expert grid splits into "run 1" / "run 2" with a *different* ~11 experts lit, the shared (cool) cell lit in both, and the "same task → a different ~11 fire" caption appears.
- No SVG overflow/clipping at 1440×900. (If any label collides or clips, nudge the affected `x`/`y` constants in `21-dense-vs-moe.tsx`; geometry tuning is expected.)

- [ ] **Step 3: Verify slide 22 (`model-zoo`)**

Navigate `→` to `#21/0`. Confirm:
- Eyebrow reads `models · 16a`; all 8 rows stagger in; Qwen 3.5 and Gemma 4 are highlighted (tinted background, colored left border, `◀ prev slide` tag).
- Both dashed callouts ("why Claude & GPT win" / "how open models close it") fit side by side; the `*` footnote shows.
- Table fits without horizontal overflow at 1440×900. (If the 4-column grid is tight, widen the viewport or reduce the `GRID` template column widths in `22-model-zoo.tsx`.)

- [ ] **Step 4: Verify recap links**

Navigate `→` to `#22/0` (recap). Confirm the eyebrow reads `thank you · 21`, and the grid now includes "Dense vs MoE" and "Model zoo" tiles. Click each and confirm it jumps to `#20/0` and `#21/0` respectively.

- [ ] **Step 5: Stop the dev server** (Ctrl-C).

---

## Self-review notes (already reconciled)

- **Spec coverage:** dense-vs-moe diagram + 3 levers + closer → Task 1; comparison table (8 models incl. both required) + two takeaway callouts → Task 2; placement between Skills & Recap + recap entry + renumber → Task 3; manual pass → Task 4. All spec sections covered.
- **Type consistency:** `denseVsMoeSlide` / `modelZooSlide` / `recapSlide` export names match their `index.ts` imports; `Slide`, `Build`, `Split`, `Stack`, `Eyebrow`, `SlideTitle`, `BodyText` signatures match their definitions (`Build` takes `step`/`appearAt`; `SlideTitle`/`BodyText` take `size`).
- **No placeholders:** every code step contains complete, runnable module content.
```
