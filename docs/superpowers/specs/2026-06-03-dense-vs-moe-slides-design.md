# Dense vs MoE Slides — Design

## Purpose

Add two slides to the LLM slide deck that explain dense vs mixture-of-experts (MoE)
architectures, and give the audience a *weighted* understanding of why Claude and GPT
models are currently so much better as agents — and what open-weight models can do to
close the gap.

Audience is the same as the rest of the deck: teammates with little prior AI exposure.
The slides must be technically defensible to a sharp reader while staying intuitive.

## The thesis (agreed framing)

The honest story is **not** "MoE bad, dense good." The strongest frontier models are
almost certainly MoE too. The real gap between a model like Qwen 3.5 and frontier agents
comes from three levers:

1. **Active compute per token** — what you pay for (and "think with") each step is the
   *active* parameters, not the total. Qwen 3.5 activates 17B of 397B, so a single step is
   closer to a 17B model than a 397B one.
2. **Routing stability** — fine-grained MoE decides which experts fire on the fly. Small
   input changes (a reworded prompt, an injected skill) — or even repeated runs — can
   select a different "committee," which makes behavior jumpy and hard to steer.
3. **Agentic RL post-training** — agent skill comes from heavy RL post-training. MoE makes
   this harder because the router drifts between training and inference; frontier labs
   spend enormously to stabilize it.

Closed frontier models (GPT-5.5, Claude Opus 4.7) pair a larger active budget with
stabilized routing and far more agentic RL — *that's* the difference, not sparse-vs-dense.

## Grounding facts (researched June 2026)

- **Qwen 3.5 397B-A17B** (Alibaba, released Feb 2026): MoE, 397B total / 17B active, 512
  experts with 10 routed + 1 shared active per token (4× the expert count of Qwen3's 128),
  60 layers, hybrid attention. The fine-grained-MoE anchor.
- **Gemma 4 31B** (Google, released Apr 2026): dense, ~30.7B params, all active every
  forward pass. Apache 2.0. The dense anchor.
- Other frontier/strong models (for the comparison table): DeepSeek V4 (1.6T/49B active,
  MoE), GLM-5.1 (744B/40B, MoE), Kimi K2.6 (1T/32B, MoE), Llama 4 (open MoE). GPT-5.5 and
  Claude Opus 4.7 internals are **not public** — MoE is inferred, not confirmed; the table
  marks them honestly.
- Routing-instability evidence: up to ~33% of tokens switch their assigned expert in late
  training; small input perturbations can flip routing; selections can diverge across
  identical forward passes. MoE RL is stabilized by aligning train-time and inference-time
  routers — directly relevant to "how open models improve."

Sources:
- https://artificialanalysis.ai/articles/qwen3-5-397b-a17b-everything-you-need-to-know
- https://recipes.vllm.ai/Qwen/Qwen3.5-397B-A17B
- https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/
- https://www.modular.com/models/gemma-4-31b-it
- https://qubittool.com/blog/llm-landscape-may-2026-deepseek-qwen-llama-comparison
- https://wavespeed.ai/blog/posts/glm-5-1-vs-claude-gpt-gemini-deepseek-llm-comparison/
- https://arxiv.org/pdf/2505.00792 (routing instability)
- https://openreview.net/forum?id=6LORvHYkV3 (aligning train/inference routers for MoE RL)

## Placement

Two new slides between Skills (`configuration · 15`) and Recap (`thank you · 19`), in a
new `models` section. They mirror the existing `memory` / `memory-approaches` pair: a
concept slide followed by a comparison-table slide.

- Eyebrows: `models · 16` (dense-vs-moe) and `models · 16a` (model-zoo).

## Slide 21 — `dense-vs-moe` (`models · 16`)

- **id:** `dense-vs-moe`
- **title:** "A dense model uses all of itself. An MoE picks a committee — per token."
- **layout:** `Split` (text left, SVG diagram right), like `llm-shape`.
- **totalSteps:** 5

### Diagram (right pane, SVG, complexity ~ `attention-deep`/`llm-shape`)

- **Gemma 4 (dense):** one solid block fully lit in `--cool`, label `31B · all active`,
  arrow straight through.
- **Qwen 3.5 (MoE):** a token vector → a **router** node → fan-out into a grid representing
  **512 experts**; only ~11 lit in `--accent`, the rest dim. Label
  `397B total · 17B active · 11 of 512 fire`.
- **Routing-roulette payoff:** at the lever-2 step, a *second* token lights a **different**
  subset of experts, visualizing "which experts fire shifts with tiny changes, even
  run-to-run."

### Left-side text builds (via `Build` + `BodyText`)

0. *(intro)* Gemma 4 is **dense**: all 31B params fire for every token. Qwen 3.5 is a
   **mixture of experts** — 397B params, but a router picks ~11 of 512 experts (**17B**)
   per token.
1. **Lever 1 · active compute.** You pay for *active* params. 17B is the real per-step
   "thinking budget" — closer to a 17B model than a 397B one for any single step.
2. **Lever 2 · routing is a roulette.** Reword a prompt, inject a skill, or just run again,
   and a different committee can pick up the task — up to a third of tokens reroute late in
   training, and picks can differ run-to-run. Steerability suffers. *(triggers the
   second-token diagram build.)*
3. **Lever 3 · agentic RL is harder on MoE.** Agent skill comes from heavy RL
   post-training; on MoE the router drifts between training and inference, so that RL is
   harder to land. Frontier labs spend enormously to stabilize it.
4. *(closer)* Frontier models are **MoE too** (DeepSeek, GLM, Kimi, and almost certainly
   GPT-5.5 & Claude). The gap isn't sparse-vs-dense — it's **active compute, routing
   stability, and agentic RL**.

## Slide 22 — `model-zoo` (`models · 16a`)

- **id:** `model-zoo`
- **title (sm):** "The 2026 model zoo, by what actually matters for agents."
- **layout:** full-width comparison table, same component pattern as `memory-approaches`
  (header row + staggered `motion.div` rows + dashed callout at the bottom).
- **totalSteps:** 1 (rows stagger in on mount).

### Columns

`model` · `total / active` · `architecture` · `as an agent`

### Rows (in order; Qwen 3.5 and Gemma 4 get a highlighted left border as the anchors)

1. **Claude Opus 4.7** — undisclosed\* — inferred MoE — heavy agentic RL; very steerable
2. **GPT-5.5** — undisclosed\* — inferred MoE — heavy agentic RL; very steerable
3. **DeepSeek V4** — 1.6T / 49B — MoE — big active budget; strongest open agent
4. **GLM-5.1** — 744B / 40B — MoE — strong open coding/agent model
5. **Kimi K2.6** — 1T / 32B — MoE — long-horizon agent focus
6. **Qwen 3.5** ◀ — 397B / 17B — MoE · 512 experts — huge knowledge, tiny active budget;
   strong but jumpy, hard to steer
7. **Llama 4** — MoE (open) — MoE — open MoE, lighter agentic RL
8. **Gemma 4** ◀ — 31B / 31B — **dense** — small but fully predictable; every param fires

\* Closed-weight internals are not public; MoE is inferred, marked honestly in the cell.

### Bottom callout (dashed box, two parts)

- **Why Claude & GPT feel better as agents** — not because they're dense (almost certainly
  MoE too), but a larger active budget + *stabilized routing* + vastly more *agentic RL*,
  so behavior stays consistent across reworded prompts, injected skills, and long tool
  loops.
- **How open models close the gap** — bigger active budgets or shared/always-on experts
  (less roulette), router stabilization (deterministic/distribution-based routing; align
  train- & inference-time routers), and far more agentic RL — *not* more raw parameters.

## Integration

- Add `app/src/slides/21-dense-vs-moe.tsx` exporting `denseVsMoeSlide`.
- Add `app/src/slides/22-model-zoo.tsx` exporting `modelZooSlide`.
- Rename `app/src/slides/21-recap.tsx` → `23-recap.tsx` (the exported `recapSlide` and its
  `id: 'recap'` are unchanged, so existing `#<n>/<step>` URLs to recap still resolve by id;
  only the numeric position shifts).
- Update `app/src/slides/index.ts`: import the two new slides and insert them into the
  `slides` array between `skillsSlide` and `recapSlide`.
- Add a Recap entry for the new `models` topic so the recap list links to slide 21.

## Visual / style constraints

- Reuse existing primitives only: `Split`, `Stack`, `Row`, `Build`, `Eyebrow`,
  `SlideTitle`, `BodyText`, and the `memory-approaches` table pattern.
- Colors from existing CSS vars: `--accent` for MoE / Qwen, `--cool` for dense / Gemma,
  plus `--ink`, `--ink-soft`, `--ink-mute`, `--line`, `--bg-elev`, `--mono`, `--display`.
- No new dependencies. No backend, no model calls — all content is static.

## Testing

- Smoke test (if present): the existing "mount every slide at every step" test must cover
  the two new slides at every step with no errors.
- `npm run build` / typecheck passes.
- Manual pass at 1440×900: step through slide 21's 5 builds (diagram second-token reroute
  fires at lever 2); confirm slide 22's table fits without overflow and the callout is
  legible; confirm Recap links to the new slide.

## Out of scope (YAGNI)

- No live model calls or real routing computation — the expert grid is illustrative.
- No exact active-param figures for closed models — they stay marked "undisclosed".
- No changes to the deck shell, navigation, or other slides beyond the recap entry.
