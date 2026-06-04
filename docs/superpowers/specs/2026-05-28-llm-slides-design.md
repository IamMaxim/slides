# LLM Slides — Design

## Purpose

An interactive slides website that explains LLMs, agents, and harnesses to teammates with little prior AI exposure. Used live (presenter mode) and self-guided.

## Approach

- **Tech stack:** Vite + React + TypeScript + Framer Motion
- **Navigation:** Keyboard deck (←/→/space). One slide visible at a time. Steps within a slide advance the same way as slides; the deck shell decides whether a key press advances a build-step or moves to the next slide.
- **Pedagogy:** Each topic uses progressive builds inside a single slide — intuition first, then deeper layers revealed by pressing forward (Keynote-style builds).
- **Style:** Dark, technical, diagram-forward. The concrete visual language is established with the `frontend-design` skill at implementation time. SVG for diagrams, Framer Motion for builds.

## Architecture

### Deck shell

- `App` owns `(slideIndex, stepIndex)` and a flat array of `Slide` definitions.
- URL hash `#<slideIndex>/<stepIndex>` is synced both ways so refresh and link-sharing land on the right step.
- Keyboard handler: `→`/`Space` → `stepIndex++`; if `stepIndex === slide.totalSteps - 1`, instead move to next slide at step 0. `←` is the reverse. `Home`/`End` jump to first/last slide.
- Progress UI: a thin bar at the bottom showing slide position + step dots for the current slide.

### Slide interface

```ts
type Slide = {
  id: string;            // stable, used in URL hash + as React key
  title: string;
  totalSteps: number;
  render(step: number): ReactNode;
};
```

Slides import shared primitives but otherwise own their layout entirely. This keeps each slide a small, self-contained file you can read top to bottom.

### Shared primitives

- `Stage` — centered canvas-like area with consistent padding; handles the dark backdrop and optional grid.
- `Caption` — top-left chip showing slide number + title.
- `StepHint` — bottom-right "→ next" indicator that fades when at last step.
- `Build` — utility component that takes `appearAt: number` (and optional `disappearAt: number`) and animates children in/out based on `step`.
- `Token` — pill rendering a single token (used in tokenizer + attention slides).
- `Diagram` — SVG wrapper with a viewBox-based coordinate system so positions stay stable across resize.

### File layout

```
src/
  App.tsx
  deck/
    Deck.tsx            // shell, keyboard, URL hash sync, progress bar
    Stage.tsx
    Build.tsx
    StepHint.tsx
    Caption.tsx
  ui/
    Token.tsx
    Diagram.tsx
  slides/
    01-title.tsx
    02-neuron.tsx
    03-network.tsx
    04-transformer-block.tsx
    05-llm-shape.tsx
    06-text-vs-tokens.tsx
    07-tokenizer.tsx
    08-attention-intuition.tsx
    09-attention-deep.tsx
    10-next-token.tsx
    11-chat.tsx
    12-tools.tsx
    13-agent-loop.tsx
    14-harness.tsx
    15-compaction.tsx
    16-system-prompts.tsx
    17-skills.tsx
    18-recap.tsx
    index.ts            // exports ordered slide list
  styles.css
```

## Slide content (with build steps)

1. **Title** — "How LLMs, agents, and harnesses actually work." Subtitle + start hint. 1 step.
2. **Neuron** — (a) a dot labeled "neuron"; (b) inputs x1..xn arrive; (c) weights w1..wn appear; (d) weighted sum; (e) activation σ; (f) output. 6 steps.
3. **Network** — (a) one neuron; (b) a layer of neurons; (c) stack into multiple layers; (d) caption: "this is a function approximator." 4 steps.
4. **Transformer block** — (a) tokens-as-vectors flowing in; (b) attention sublayer; (c) feed-forward sublayer; (d) residual connection; (e) layer-norm. 5 steps.
5. **LLM shape** — (a) embedding; (b) stack of N blocks; (c) unembed; (d) logits → softmax → probabilities. 4 steps.
6. **Text vs tokens** — (a) text is bytes; (b) tokens are learned chunks; (c) reveal that "tokens ≠ words." 3 steps.
7. **Interactive tokenizer** — textarea + live token highlights using `gpt-tokenizer` (cl100k_base). 1 step (always interactive).
8. **Attention intuition** — (a) one sentence as tokens; (b) one token "looks at" prior ones; (c) arrows with varying thickness for weights; (d) hover any token to light its weights. 4 steps.
9. **Attention deep** — (a) each token has Q, K, V vectors; (b) Q·K dot products → scores; (c) softmax → attention weights matrix; (d) weighted sum of V vectors. 4 steps.
10. **Next-token prediction** — preloaded prompt; (a) prompt shown; (b) probability distribution over candidate next tokens; (c) sample one; (d) append; (e) loop button "next token" rolls again. 5 steps.
11. **Chat** — (a) raw completion; (b) chat template with role markers; (c) multi-turn assistant/user alternation. 3 steps.
12. **Tools** — (a) tool schema; (b) model emits `tool_use` JSON; (c) harness runs the tool; (d) `tool_result` returned; (e) model continues. 5 steps.
13. **Agent loop** — (a) model; (b) add tools; (c) add environment; (d) loop arrows; (e) caption: "this loop is the agent." 5 steps.
14. **Harness** — (a) the runtime; (b) what it owns: prompt assembly, tool execution, state, retries, permissions. 2 steps.
15. **Compaction** — (a) context window filling up; (b) older turns highlighted; (c) replaced by a summary; (d) conversation continues. 4 steps.
16. **System prompts** — (a) message stack with role markers; (b) priority order: system → developer → user. 2 steps.
17. **Skills** — (a) a small set of always-loaded instructions; (b) more skills available on demand; (c) harness loads relevant ones based on the task. 3 steps.
18. **Recap** — list of all topics covered, each clickable to jump back. 1 step.

## Interactive widgets

### Tokenizer (slide 7)

- `gpt-tokenizer` npm package, browser-safe, no backend.
- Layout: textarea on the left (default text prefilled with a sentence that produces interesting tokens like contractions, punctuation, leading spaces); token pills on the right with alternating colors and token IDs underneath.
- Updates on input change, debounced 50ms.
- Token pills preserve whitespace visibly (a leading space is rendered as `·` inside the pill so the chunking is legible).

### Attention hover (slides 8–9)

- Tokens in a single example sentence. Hovering a token computes a fake-but-plausible weight vector (predefined per sentence) and renders arrows or a matrix row of varying opacity.
- No real attention computation — these slides are explanatory, not a demo of a real model.

### Sampler (slide 10)

- Preloaded prompt: e.g., `"The cat sat on the"`.
- Per step, show a small bar chart of 5–8 candidate next tokens with hand-tuned probabilities (`mat 0.42, rug 0.18, ...`).
- "Roll" button samples from the distribution, appends the chosen token, advances to the next preloaded distribution (3–4 prepared distributions in sequence).

## Data flow

- All slide content is static or computed in-component. No backend, no model calls.
- Tokenizer + sampler are pure client-side. Tokenizer uses the npm package; sampler uses pre-baked distributions.
- URL hash is the only piece of cross-cutting state outside React; `Deck` reads it on mount and writes it on change.

## Error handling

- Invalid URL hash (out-of-range slide/step) → clamp to nearest valid and rewrite the hash.
- Tokenizer init failure → fall back to a regex-based word/punctuation splitter and show a one-line "approximate tokenization" notice.
- Keyboard handler ignores keys when focus is inside the tokenizer textarea, so the user can type freely.

## Testing

- Component tests: `Build` correctly shows/hides children at the right step; `Deck` advances steps then slides on `→`; URL hash sync round-trips.
- One smoke test that mounts every slide at every step and asserts no errors thrown.
- Manual test pass: open in Chrome on a 1440×900 laptop screen (presentation target) and step through each slide end-to-end.

## Out of scope (YAGNI)

- No backend, no real model calls.
- No presenter notes / speaker view.
- No mobile or touch-optimized layout. Laptop projector target only.
- No PDF or static export.
- No theming / light mode.
- No i18n.

## Open questions

None blocking implementation.
