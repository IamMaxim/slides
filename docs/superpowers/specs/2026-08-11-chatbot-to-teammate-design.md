# От чатбота до тиммейта — deck design (part 2)

Date: 2026-08-11
Status: approved (structure A; user judges final slides once coherent)

## Overview

Second deck in the series, continuing `whats-a-harness`. One-hour talk, Russian
language (English tech terms inline, matching part 1's style). New directory
`chatbot-to-teammate`, reusing part 1's deck engine verbatim (`Deck`, `Stage`,
`Build`, `Caption`, `StepHint`, `ProgressBar`, `ui/` components, same palette
and typography).

**Thesis / spine:** the history of AI coding tools is the history of relocating
the feedback loop — through the human's clipboard (ChatGPT) → a keystroke
(Copilot) → the IDE (Cursor) → the whole dev environment (Claude Code) → a
reusable artifact (goal slash commands) → graphs of loops (dynamic workflows) →
the team itself (agent-native infrastructure).

**Structure:** A — chronological arc as spine; each era expands into its
engineering principle in place. Horror-story cold open stolen from option B.

**Punchline:** your job shifts from writing code to engineering the environment
in which code gets written. Skip that shift and you get the shitcode flood, not
velocity.

**Recurring visual device:** the feedback loop as a physical object that
migrates era to era. A shared `EraTimeline` component appears on every era
slide with the current era highlighted, and replays end-to-end in the recap.

## Audience & constraints

- Same audience as part 1: developers who saw part 1 (know: agent loop,
  harness, compaction, memory, skills, MCP).
- No live demos, no recordings. Slides carry rich build-step animations
  (part 1 idiom: SVG diagrams driven by `step`, framer-motion transitions).
  A live demo happens after the talk, outside the deck.
- ~35 slides for 60 minutes. Cut order if long: merge 13→12, merge 21→20,
  drop 22, drop 31.
- Reference part 1 material (compaction, harness engineering) — never repeat it.

## Deck infrastructure

- Copy `whats-a-harness` scaffold (vite/tsconfig/eslint/package.json,
  `src/deck/`, `src/ui/`, `index.css`, favicon), delete part-1 slides.
- New shared component `src/ui/EraTimeline.tsx`: horizontal 6-era strip
  (чатбот → автокомплит → агент в IDE → harness → команды → графы), current
  era accent-highlighted, used by era-transition slides.
- Slides live in `src/slides/NN-id.tsx`, registered in `src/slides/index.ts`.
- Update root `README.md` deck table with the new deck (RU).

## Slide-by-slide

Each entry: `file — RU title — steps — content & animation`.

### Opening

1. `01-title` — «От чатбота до тиммейта» — 1 step. Part 2 marker, subtitle
   «инженерия циклов, графов и агентно-нативных команд». Same composition as
   part 1 title.
2. `02-horror` — «MR на 700 строк» — 4 steps. Cold open horror story: an MR
   diff that scrolls endlessly (animated fake diff), counters LOC ↑ /
   velocity ↓, a reviewer buried under diffs. Beat: agents write faster than
   humans review; naive adoption *slows the team down*. «Этот доклад — про то,
   как этого не допустить.»
3. `03-claim` — «история — это миграция цикла» — 3 steps. The claim: every era
   = the feedback loop moving closer to the model. Introduce the loop glyph
   and the EraTimeline (all eras dimmed). This device recurs.

### Act 1 — eras (brisk)

4. `04-era-chatgpt` — «эра 1: человек-harness» — 4 steps. Diagram: human node
   center, browser (ChatGPT) left, IDE right; animated clipboard shuttling
   context in / code out / errors back. The loop drawn *through the human* —
   human is the bottleneck at every iteration. Great for snippets, collapses
   on repos.
5. `05-era-copilot` — «эра 2: глаза без рук» — 4 steps. Ghost-text typing
   animation; the loop shrinks to a keystroke. Model sees a window around the
   cursor, cannot act or verify. Value = keystrokes saved; failure mode =
   plausible-looking wrong code. Single-shot: no second attempt.
6. `06-era-cursor` — «эра 3: цикл появился» — 4 steps. Model node sprouts
   tool-arms (edit / run / read); propose → observe → correct cycle spins
   autonomously for the first time. Generation becomes *search*. Human still
   babysits every turn inside the IDE.

### Act 2 — loop engineering (expands from era 3)

7. `07-loop-search` — «генерация → поиск» — 4 steps. Split animation: two
   agents on the same task. Left: no feedback — random walk through solution
   space (wandering dot). Right: with tests — trajectory converges (dot homes
   in). Core equation: качество агента = качество модели × качество обратной
   связи. The second factor is yours.
8. `08-feedback-ladder` — «лестница обратной связи» — 6 steps. Ladder rungs
   animate in: compile → types → lint → unit → integration → telemetry. Each
   rung lights an autonomy meter. Untyped code, slow tests, silent failures =
   handicaps for the agent, not just tech debt.
9. `09-definition-of-done` — «машинно-проверяемое done» — 4 steps. Loop with
   exit gate. No gate: spins forever (gold-plating) or exits early. Gate =
   acceptance criteria = literally the agent's prompt. Ticket quality is now
   an engineering artifact.
10. `10-agent-errors` — «ошибки, понятные агенту» — 3 steps. Two error
    messages side by side: «something went wrong» vs «expected X at
    config.ts:42». Agent reaction animated: flailing vs direct fix. Error
    quality is API design for agents.
11. `11-context-hygiene` — «гигиена контекста» — 4 steps. Context window
    filling with debris over a long session; quality curve dropping; restart
    clears it. Rule: одна задача = один контекст. Callback to part 1's
    compaction slide.
12. `12-era-claude-code` — «эра 4: цикл размером со среду» — 4 steps.
    EraTimeline advances. Terminal-centric graph: git, tests, hooks,
    subagents, permissions — the loop now encloses the whole dev environment.
    Bridge from part 1's harness slides.
13. `13-hooks-guardrails` — «детерминированные рельсы» — 3 steps. Hooks and
    permissions as solid rails around a stochastic model: pre/post-tool hooks
    firing deterministically in the loop diagram. Determinism where possible.

### Act 3 — process engineering: slash commands

14. `14-era-commands` — «эра 5: промпт → артефакт» — 4 steps. EraTimeline
    advances. Animation: a chat prompt evaporating (ephemeral) vs a command
    file crystallizing into the repo (versioned, reviewed, shared).
    «Команда — это функция; промпт — строка в REPL.» Community pattern:
    goal-oriented slash commands / skills.
15. `15-goal-anatomy` — «анатомия goal-команды» — 5 steps. Parts assemble
    into a running loop: goal + guardrails + validation loop + stop
    condition → run until green or blocked. Each part animates into place.
16. `16-team-knowledge` — «команды как память команды» — 3 steps. Individual
    workflows flow into a shared library, then into every agent (and every
    new teammate). Institutional knowledge that executes.

### Act 4 — graph engineering

17. `17-era-graphs` — «эра 6: одного цикла мало» — 4 steps. EraTimeline
    completes. Why graphs: context limits, parallelism, and *independent
    judgment* — a verifier sharing the author's context inherits its blind
    spots. Animation: one overloaded context vs fan-out into fresh ones.
18. `18-determinism-split` — «код оркеструет, агенты судят» — 3 steps. Graph
    skeleton drawn solid (deterministic: loops, conditionals, fan-out); agent
    nodes glow (stochastic judgment). Spend tokens only where judgment lives.
19. `19-pipeline-barrier` — «pipeline против barrier» — 4 steps. Items flow
    through stages. Barrier version: fast items idle at the fence (visible
    wasted wall-clock). Pipeline version: overlap. Default to pipeline.
20. `20-adversarial` — «адверсариальная проверка» — 5 steps. The shitcode
    killer. A finding appears; three skeptic agents attack it (prompted to
    *refute*); two refute → finding dies (animated strikethrough/dissolve);
    a survivor gets «confirmed» badge. Independence is the point.
21. `21-judge-dry` — «панель судей и цикл до сухого» — 4 steps. Two mini
    patterns: N candidate solutions scored by judges (winner + grafted ideas);
    discovery loop that stops only after 2 dry rounds (counters miss the
    tail).
22. `22-schemas` — «схемы — типы графа» — 3 steps. Structured-output schema
    drawn as a shaped pipe between agents; malformed output visually bounces
    off; valid output flows through. Contracts between stochastic parts.
23. `23-budget` — «ручка бюджета» — 3 steps. A budget slider morphs the same
    workflow graph from small (50k tokens, quick check) to large (500k,
    adversarial audit). Thoroughness is a parameter, not a rewrite.

### Act 5 — the agent-native team

24. `24-bottleneck` — «бутылочное горлышко переехало» — 4 steps. Callback to
    slide 2 with the diagnosis: throughput pipe with «review» as the narrow
    section; writing widened, reviewing didn't. Velocity is bounded by review
    bandwidth (Amdahl for agent teams).
25. `25-shift-left` — «валидация до человека» — 5 steps. MR passes machine
    gates in a loop until green — lint, types, tests, self-review — *before*
    reaching the human desk. Human reviews pre-verified diffs only. «Не
    тратьте ревью человека на то, что могла отклонить машина.»
26. `26-review-to-lint` — «каждый повторный комментарий — недостающий
    линтер» — 4 steps. A recurring review comment is forged (animated) into a
    custom lint rule; the next violation is caught by the gate before any
    human sees it. Team taste compiles into infrastructure.
27. `27-repo-prompt` — «кодовая база — это промпт» — 5 steps. Repo elements
    light up as readable by both species: CLAUDE.md (onboarding both read),
    small focused modules (fit in context), conventions over cleverness, fast
    deterministic tests (<5 min or agents stall), sandboxes/worktrees so the
    agent can actually run the app.
28. `28-trust-ladder` — «лестница доверия» — 5 steps. L0 suggestions → L1
    supervised edits → L2 agent opens MRs → L3 auto-merge for low-risk
    classes. Locks open as the validation stack grows. Climb per *task
    class*, unlocked by validation maturity, not vibes.
29. `29-metrics` — «метрики, которые не врут» — 4 steps. Two dashboards:
    vanity (LOC, PRs opened — big and green) vs real (cycle time, review
    iterations per MR, revert rate, escaped defects). Vanity dashboard
    flagged as theater.
30. `30-antipatterns` — «галерея антипаттернов» — 5 steps. Quick-hit animated
    icons: prompt-and-pray; MR на 700 строк; rubber-stamp review (agent
    reviewing agent without adversarial framing); velocity theater; marathon
    context. Each gets one line.
31. `31-what-stays-human` — «что остаётся человеку» — 4 steps. Taste,
    architecture decisions, product judgment, the *content* of the linters.
    Honest open question: onboarding juniors in an agent-native team.
32. `32-role-shift` — «инженер среды» — 3 steps. A figure steps out of the
    loop to stand beside the graph, holding the dials. From writing code to
    engineering the system that produces code.

### Close

33. `33-monday` — «утро понедельника» — 5 steps. Checklist animates in:
    1) написать CLAUDE.md; 2) тесты одной командой; 3) три последних
    review-комментария → lint-правила; 4) один workflow → slash-команда.
34. `34-recap` — «вся дуга» — 7 steps. EraTimeline full; the loop glyph
    replays its migration end-to-end, each era stamping its principle
    (feedback, done-gate, артефакт, граф, команда). One-line takeaway.
35. `35-final` — «вопросы» — 1 step. Q&A, link to deck, part-1 reference.

## Error handling / robustness

Static SPA; no runtime failure modes beyond render. Constraints: all slides
must type-check (`tsc -b`), pass `eslint`, and render at 1280×720 through
1920×1080 without layout overflow (Stage handles scaling as in part 1).
Animations must be step-driven (idempotent per step, reversible when stepping
back) — no wall-clock-only animations that desync from navigation, except
looping ambient motion (e.g. the scrolling diff) which must be
`repeat: Infinity` and step-independent.

## Testing

Same bar as part 1: `npm run build` (tsc + vite) and `npm run lint` clean;
manual visual pass through all slides/steps in dev server. No unit tests —
deck engine is copied, not modified.
