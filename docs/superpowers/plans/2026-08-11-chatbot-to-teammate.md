# «От чатбота до тиммейта» Deck Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the part-2 slide deck `chatbot-to-teammate` — 35 animated Russian-language slides covering loop engineering, graph engineering, and agent-native teams, per `docs/superpowers/specs/2026-08-11-chatbot-to-teammate-design.md`.

**Architecture:** New Vite/React deck directory copied from the `whats-a-harness` template; the deck engine (`src/deck/`) and base UI (`src/ui/`) are reused verbatim; one new shared component (`EraTimeline`); each slide is a self-contained `src/slides/NN-id.tsx` exporting a `Slide` object with step-driven framer-motion/SVG animation, registered in `src/slides/index.ts`.

**Tech Stack:** React 19, TypeScript, Vite, framer-motion 12. No new dependencies.

## Global Constraints

- Language: Russian slide copy, English tech terms inline (`tool_use`, `harness`, `lint`) — match part 1's voice: informal «ты»-form, punchy, no corporate speak.
- Reuse part-1 idiom exactly: `Slide` type (`id`, `title`, `totalSteps`, `render({step})`), `Build` for text reveals, inline SVG diagrams driven by `step`, CSS vars for all colors (`--accent`, `--cool`, `--warn`, `--ink*`, `--bg-elev`, `--line`), fonts via `var(--display)/var(--mono)`.
- Animations must be step-driven and reversible (stepping back must restore the previous visual). Ambient motion (endless scroll, pulse) must be `repeat: Infinity` and step-independent.
- Every slide's `title` is lowercase RU (part-1 convention, e.g. «цикл агента»).
- Eyebrow convention per act: opening «пролог · N», eras/story «история · N», act 2 «инженерия циклов · N», act 3 «process engineering · N», act 4 «инженерия графов · N», act 5 «агентная команда · N», close «финал · N». N = slide number within the deck (1-based).
- Verification per task: `npm run build` (tsc + vite) and `npm run lint` clean from `chatbot-to-teammate/`. No unit tests (engine is copied, not modified).
- Commit after each task with a short message; end commit messages with the standard Claude trailer.

---

### Task 1: Scaffold the deck from the part-1 template

**Files:**
- Create: `chatbot-to-teammate/` (copy of `whats-a-harness/` minus slides, minus `node_modules`, `dist`, `package-lock.json` kept)
- Modify: `chatbot-to-teammate/index.html`, `chatbot-to-teammate/README.md`, `chatbot-to-teammate/package.json` (name), `README.md` (root deck table)
- Create: `chatbot-to-teammate/src/slides/index.ts` (empty registry + placeholder title slide so the deck runs)

**Interfaces:**
- Consumes: `whats-a-harness/` template.
- Produces: a running deck at `chatbot-to-teammate/` where later tasks only add `src/slides/NN-id.tsx` files and register them in `src/slides/index.ts` (`export const slides: Slide[]`).

- [ ] **Step 1: Copy template**

```bash
cd /Users/maxim/work/slides
rsync -a --exclude node_modules --exclude dist whats-a-harness/ chatbot-to-teammate/
rm chatbot-to-teammate/src/slides/*.tsx
```

- [ ] **Step 2: Update metadata**

In `chatbot-to-teammate/package.json` set `"name": "chatbot-to-teammate"`. In `index.html` set `<title>От чатбота до тиммейта</title>`. Rewrite `chatbot-to-teammate/README.md`:

```markdown
# От чатбота до тиммейта

Part 2 of the agents series: loop engineering, graph engineering, and
agent-native teams — told as the history of relocating the feedback loop
(ChatGPT → Copilot → Cursor → Claude Code → slash commands → dynamic
workflows → the team).

## Running locally

npm install && npm run dev — then open http://localhost:5173.
Navigate with ← / → or Space.
```

Add to root `README.md` deck table: `| [\`chatbot-to-teammate\`](./chatbot-to-teammate) | От чатбота до тиммейта | RU |`.

- [ ] **Step 3: Minimal registry**

`chatbot-to-teammate/src/slides/index.ts`:

```ts
import type { Slide } from '../deck/types';

export const slides: Slide[] = [];
```

Note: `Deck` indexes `slides[0]` — add a temporary inline title slide so it renders:

```ts
const placeholder: Slide = {
  id: 'placeholder',
  title: 'от чатбота до тиммейта',
  totalSteps: 1,
  render: () => null,
};
export const slides: Slide[] = [placeholder];
```

(Removed in Task 2 when the real title slide lands.)

- [ ] **Step 4: Install and verify**

```bash
cd chatbot-to-teammate && npm install && npm run build && npm run lint
```

Expected: build and lint pass.

- [ ] **Step 5: Commit** — `git add -A && git commit -m "Scaffold chatbot-to-teammate deck from template"`

---

### Task 2: EraTimeline shared component + bookend slides (01, 35)

**Files:**
- Create: `chatbot-to-teammate/src/ui/EraTimeline.tsx`
- Create: `chatbot-to-teammate/src/slides/01-title.tsx`, `chatbot-to-teammate/src/slides/35-final.tsx`
- Modify: `chatbot-to-teammate/src/slides/index.ts` (register, drop placeholder)

**Interfaces:**
- Produces: `EraTimeline({ current, revealed, compact }: { current?: number; revealed?: number; compact?: boolean })` — horizontal 6-era strip. `revealed` = how many eras are visible (default 6); `current` = index (0–5) highlighted with `--accent` (others `--ink-mute`); `compact` renders a small strip for use as a corner progress marker on era slides. Era labels, in order: `чатбот`, `автокомплит`, `агент в IDE`, `harness`, `slash-команды`, `графы агентов`.
- Produces: slide exports `titleSlide`, `finalSlide`.

- [ ] **Step 1: Implement `EraTimeline`**

Visual: a horizontal row of 6 labeled dots connected by a line; the loop glyph (small circular-arrows icon, inline SVG) sits above the `current` era and slides horizontally (framer-motion `layout`/animate on x) when `current` changes between slides. Non-revealed eras render at opacity 0.15 (dimmed placeholders keep layout stable). Use `var(--mono)` 11px uppercase labels, letterSpacing 0.08em.

- [ ] **Step 2: Title slide `01-title`** — 1 step. Composition mirrors part 1's `01-title.tsx` (read it first). Title: «От чатбота до тиммейта». Subtitle: «инженерия циклов, графов и агентно-нативных команд». Eyebrow: «часть 2 · agent-driven development». Include the full `EraTimeline` (all revealed, none current) as a quiet footer strip — the deck's map, planted on slide one.

- [ ] **Step 3: Final slide `35-final`** — 1 step. Centered: «вопросы?», sub-line «часть 1: что такое агенты и как их есть», mono footer with deck URL placeholder text `github.com/…/slides`. Keep minimal, mirror part 1's closing composition.

- [ ] **Step 4: Register both** in `index.ts` (title first, final last; placeholder removed).

- [ ] **Step 5: Verify + commit** — `npm run build && npm run lint`; commit `"Add EraTimeline and bookend slides"`.

---

### Task 3: Opening + eras (slides 02–06)

**Files:**
- Create: `chatbot-to-teammate/src/slides/02-horror.tsx`, `03-claim.tsx`, `04-era-chatgpt.tsx`, `05-era-copilot.tsx`, `06-era-cursor.tsx`
- Modify: `chatbot-to-teammate/src/slides/index.ts`

**Interfaces:**
- Consumes: `EraTimeline` from Task 2, `Build`, `Split`, `Stack`, `Eyebrow`, `SlideTitle`, `BodyText`, `Token`.
- Produces: slide exports `horrorSlide`, `claimSlide`, `eraChatgptSlide`, `eraCopilotSlide`, `eraCursorSlide`.

- [ ] **Step 1: `02-horror` — «MR на 700 строк», 4 steps, eyebrow «пролог · 2».**
  - Right visual: a fake MR panel (`--bg-elev` card): file header `refactor_everything.diff`, ~14 diff rows (green `+`/red `−` bars of varying width, no real code needed), auto-scrolling upward on an infinite loop (`animate={{ y: [0, -H/2] }}`, `repeat: Infinity`, linear — content duplicated twice for a seamless wrap). Above the card, two mono counters: `+8 412 строк/нед ↑` (accent) and `velocity ↓` (warn), counters appear step 1.
  - Left copy beats (Build per step): 0 «Команда подключила агентов. Код пошёл рекой.» / 1 «LOC растут. Скорость команды — падает.» / 2 «Ревьюер — новое бутылочное горлышко: агент пишет за минуты, человек читает часами.» / 3 punchline (ink): «Этот доклад — про то, как получить тиммейта, а не генератор шиткода.»
  - Step 3 also stamps a warn-tinted `Token` on the MR card: `review: 6 дней`.
- [ ] **Step 2: `03-claim` — «история — это миграция цикла», 3 steps, eyebrow «пролог · 3».**
  - Center visual: the loop glyph large (circular arrows, accent), then at step 1 the full `EraTimeline` fades in beneath (all six revealed, dimmed); at step 2 the glyph shrinks and lands on era 0.
  - Copy: 0 «Вся история AI-инструментов — это один сюжет: цикл обратной связи переезжает ближе к модели.» / 1 «Шесть эпох — шесть мест, где жил цикл.» / 2 «Каждая эпоха научила нас одному инженерному принципу. Поехали.»
- [ ] **Step 3: `04-era-chatgpt` — «эра 1: человек-harness», 4 steps, eyebrow «история · 4».**
  - `EraTimeline` compact, current=0.
  - Diagram: three nodes — браузер (ChatGPT) left, человек center, IDE right. Steps: 0 nodes; 1 animated clipboard packet shuttling человек→браузер labeled `контекст` and back labeled `код` (looping ambient motion); 2 a second packet IDE→человек labeled `ошибка` — the loop path drawn *through the human node*, human node gets warn ring; 3 annotation box: «человек — это harness. и бутылочное горлышко.»
  - Copy beats: 0 «2022. Модель умная, но заперта в чате.» / 1 «Ты носишь контекст туда, код обратно. Вручную.» / 2 «Каждая итерация цикла проходит через твой буфер обмена.» / 3 «Отлично для сниппетов. Не масштабируется на репозиторий.»
- [ ] **Step 4: `05-era-copilot` — «эра 2: глаза без рук», 4 steps, eyebrow «история · 5».**
  - `EraTimeline` compact, current=1.
  - Diagram: editor mock (mono text lines as bars); a cursor caret; at step 1 ghost-text completion appears (mute, italic mono `сгенерированное продолжение…`) with `tab` key hint; at step 2 a viewport bracket shows the model sees only a window around the cursor; at step 3 one ghost line turns warn-colored with a tiny `✓ compiles, ✗ wrong` tag.
  - Copy: 0 «Copilot вшил модель в редактор.» / 1 «Цикл сжался до одного нажатия tab.» / 2 «Модель видит окно вокруг курсора. Действовать и проверять — не может. Один выстрел.» / 3 «Плата за скорость: правдоподобно выглядящий неправильный код.»
- [ ] **Step 5: `06-era-cursor` — «эра 3: цикл появился», 4 steps, eyebrow «история · 6».**
  - `EraTimeline` compact, current=2.
  - Diagram: model node center; step 1 tool-arms sprout (`edit`, `run`, `read` — three small labeled nodes); step 2 the propose→observe→correct triangle draws itself and a dot begins circulating (infinite, linear); step 3 a human eye icon hovers over the loop labeled «апрув каждого шага».
  - Copy: 0 «Cursor дал модели руки.» / 1 «Редактировать файлы, запускать команды, читать ошибки.» / 2 «Впервые: предложил → посмотрел → поправил. Генерация стала поиском.» / 3 «Но человек всё ещё нянчит каждый оборот цикла.»
- [ ] **Step 6: Register, verify, commit** — append to `index.ts` in order; `npm run build && npm run lint`; commit `"Add opening and era slides (02-06)"`.

---

### Task 4: Loop engineering (slides 07–13)

**Files:**
- Create: `07-loop-search.tsx`, `08-feedback-ladder.tsx`, `09-definition-of-done.tsx`, `10-agent-errors.tsx`, `11-context-hygiene.tsx`, `12-era-claude-code.tsx`, `13-hooks-guardrails.tsx` (all under `chatbot-to-teammate/src/slides/`)
- Modify: `src/slides/index.ts`

**Interfaces:**
- Consumes: Task 2/3 components. Produces exports: `loopSearchSlide`, `feedbackLadderSlide`, `definitionOfDoneSlide`, `agentErrorsSlide`, `contextHygieneSlide`, `eraClaudeCodeSlide`, `hooksGuardrailsSlide`.

- [ ] **Step 1: `07-loop-search` — «генерация → поиск», 4 steps, eyebrow «инженерия циклов · 7».**
  - Visual: two square «solution space» panels side by side, target marked ⨯ in each. Left «без обратной связи»: dot wanders on a pre-computed random polyline (SVG `path` + `offsetDistance` or keyframed x/y array, infinite). Right «с тестами»: appears step 1; dot follows a converging spiral to the target, then pulses on it. Step 2: formula strip below: `качество агента = модель × обратная связь` (mono tokens). Step 3: highlight «обратная связь» token accent + line «второй множитель — твой».
  - Copy: 0 «Без проверки агент — это случайное блуждание, которое быстро печатает.» / 1 «Дай ему тесты — блуждание превращается в сходимость.» / 2 formula / 3 «Модель ты не контролируешь. Обратную связь — полностью.»
- [ ] **Step 2: `08-feedback-ladder` — «лестница обратной связи», 6 steps, eyebrow «инженерия циклов · 8».**
  - Visual: vertical ladder, rungs appear bottom-up one per step 0–5: `компилятор` → `типы` → `линтер` → `unit-тесты` → `integration` → `телеметрия`. Beside it an «автономия» meter (vertical bar) fills a notch per rung. Each rung: mono label + one-word payoff tag (`есть/нет`, `форма`, `стиль`, `поведение`, `сборка`, `прод`).
  - Copy (Build per step, short): 0 «Каждая ступень — сигнал, который агент видит сам.» / 2 «Нетипизированный код и медленные тесты — это гандикап для агента, а не просто техдолг.» / 5 punchline: «Сколько ступеней доступно агенту — столько автономии ты можешь ему дать.»
- [ ] **Step 3: `09-definition-of-done` — «машинно-проверяемое done», 4 steps, eyebrow «инженерия циклов · 9».**
  - Visual: the agent loop circle with a gate (turnstile) on the exit path. Step 0 no gate — dot loops forever, small counter `итерация 47…` ticking (infinite). Step 1 gate appears labeled `критерии приёмки`; dot exits after gate turns green. Step 2 the gate zooms: checklist card `- тесты зелёные / - lint чистый / - сценарий X работает`. Step 3 annotation: «тикет = промпт».
  - Copy: 0 «Без стоп-условия цикл или крутится вечно, или выходит рано.» / 1 «Выход — это машинно-проверяемое определение „готово“.» / 2 «Критерии приёмки из тикета — это буквально промпт агента.» / 3 «Качество тикетов — теперь инженерный артефакт.»
- [ ] **Step 4: `10-agent-errors` — «ошибки, понятные агенту», 3 steps, eyebrow «инженерия циклов · 10».**
  - Visual: two terminal cards. Left (step 0): `Error: something went wrong` — below it an agent icon with three spinning `?` and a flailing retry counter. Right (step 1): `Error: expected «retries» ≥ 0 at config.ts:42` — agent icon draws a straight arrow to a file node, one fix, green check. Step 2: strip: «текст ошибки — это API. Теперь у него два клиента.»
  - Copy: 0 «По этой ошибке нельзя действовать.» / 1 «По этой — можно: файл, строка, ожидание.» / 2 «Ошибки читают уже не только люди. Пиши их как интерфейс.»
- [ ] **Step 5: `11-context-hygiene` — «гигиена контекста», 4 steps, eyebrow «инженерия циклов · 11».**
  - Visual: horizontal context-window bar filling left→right with colored segments: task (accent), step 1 adds debris segments (mute: `старые диффы`, `логи`, `тупики`); above it a quality curve declining as debris grows. Step 2: bar resets — fresh bar with only `задача + выжимка`; curve jumps back up. Step 3 rule token: `одна задача = один контекст`.
  - Copy: 0 «Длинная сессия накапливает мусор: тупики, старые логи, отменённые планы.» / 1 «Мусор — это тоже промпт. Качество едет вниз.» / 2 «Перезапуск с чистым контекстом дешевле, чем героическая сессия-марафон.» / 3 «Помнишь compaction из первой части? Вот зачем он был нужен.»
- [ ] **Step 6: `12-era-claude-code` — «эра 4: цикл размером со среду», 4 steps, eyebrow «история · 12».**
  - `EraTimeline` compact, current=3.
  - Diagram: terminal node center (accent ring); step 1 environment nodes orbit in: `git`, `тесты`, `файлы`, `суб-агенты`, `MCP`; step 2 the loop path redraws to enclose *all* nodes (big loop, animated draw); step 3 annotation: «harness — из первой части. Теперь это поверхность инженерии.»
  - Copy: 0 «Claude Code и родня: агент живёт в терминале.» / 1 «Весь твой тулинг — его органы чувств.» / 2 «Цикл теперь проходит через всю среду разработки.» / 3 «Дальше вопрос не „умная ли модель“, а „что мы встроили в её цикл“.»
- [ ] **Step 7: `13-hooks-guardrails` — «детерминированные рельсы», 3 steps, eyebrow «инженерия циклов · 13».**
  - Visual: the loop from slide 12, simplified; step 0 a `pre-hook` block snaps onto the path before the tool node (solid, square = deterministic), step 1 a `post-hook` after it (e.g. `lint --fix`, `запрет push в main`); square blocks contrast with the round stochastic model node. Step 2 formula strip: `детерминизм — где можно, интеллект — где нужно`.
  - Copy: 0 «Хуки срабатывают всегда. Не „модель обычно слушается“, а „система не позволит иначе“.» / 1 «Форматирование, запреты, авто-проверки — рельсы вокруг стохастической модели.» / 2 «Это главный принцип всей второй половины доклада. Запомни его.»
- [ ] **Step 8: Register, verify, commit** — `"Add loop engineering slides (07-13)"`.

---

### Task 5: Slash commands (slides 14–16)

**Files:**
- Create: `14-era-commands.tsx`, `15-goal-anatomy.tsx`, `16-team-knowledge.tsx`
- Modify: `src/slides/index.ts`

**Interfaces:** produces `eraCommandsSlide`, `goalAnatomySlide`, `teamKnowledgeSlide`.

- [ ] **Step 1: `14-era-commands` — «эра 5: промпт → артефакт», 4 steps, eyebrow «история · 14».**
  - `EraTimeline` compact, current=4.
  - Visual: left a chat bubble with a long prompt (mono, truncated) that at step 1 dissolves into particles (opacity/blur/y-scatter on ~8 fragments); right a file card `/.claude/commands/release.md` crystallizes (assembles from the same particle positions) with `git`-style `v3` tag. Step 2: three small badges on the file: `версионируется`, `ревьюится`, `шарится`. Step 3: aphorism strip: «команда — это функция. промпт — строка в REPL.»
  - Copy: 0 «Хороший промпт умирал вместе с чатом.» / 1 «Сообщество придумало: заворачивать цель в slash-команду — файл в репозитории.» / 2 «Промпт-инжиниринг стал process-инжинирингом.» / 3 aphorism echo.
- [ ] **Step 2: `15-goal-anatomy` — «анатомия goal-команды», 5 steps, eyebrow «process engineering · 15».**
  - Visual: four labeled blocks fly in one per step and snap into a vertical pipeline: `цель` (что должно стать правдой) → `ограничения` (что нельзя) → `цикл валидации` (loop icon: правь → проверяй) → `стоп-условие` (зелёный gate или «заблокирован — зови человека»). Step 4: the assembled pipeline animates one full run: dot travels, loops twice in the validation ring, exits green.
  - Copy per block, then punchline: «Запустил — и агент работает до „готово“ или до честного „не могу“. Это уже не подсказка. Это делегирование.»
- [ ] **Step 3: `16-team-knowledge` — «команды как память команды», 3 steps, eyebrow «process engineering · 16».**
  - Visual: three person nodes top, each with a small command file; step 1 files flow into a central repo box `.claude/commands/`; step 2 arrows fan out from the repo to N agent nodes below *and* to a new-teammate node («новичок читает то же самое»).
  - Copy: 0 «У каждого в голове — свой лучший workflow.» / 1 «Слитые в репозиторий, они становятся институциональной памятью.» / 2 «Памятью, которая исполняется. Онбординг для людей и агентов — один и тот же файл.»
- [ ] **Step 4: Register, verify, commit** — `"Add slash command slides (14-16)"`.

---

### Task 6: Graph engineering (slides 17–23)

**Files:**
- Create: `17-era-graphs.tsx`, `18-determinism-split.tsx`, `19-pipeline-barrier.tsx`, `20-adversarial.tsx`, `21-judge-dry.tsx`, `22-schemas.tsx`, `23-budget.tsx`
- Modify: `src/slides/index.ts`

**Interfaces:** produces `eraGraphsSlide`, `determinismSplitSlide`, `pipelineBarrierSlide`, `adversarialSlide`, `judgeDrySlide`, `schemasSlide`, `budgetSlide`.

- [ ] **Step 1: `17-era-graphs` — «эра 6: одного цикла мало», 4 steps, eyebrow «история · 17».**
  - `EraTimeline` compact, current=5 (arc complete — brief accent flash across all eras).
  - Visual: one context bar overstuffed (from slide 11's visual language) with three task blocks jammed in, warn tint; step 1 it splits — fan-out to three fresh agent nodes, each with its own small loop; step 2 a fourth node appears labeled `проверяющий`, pointedly *not* connected to the авторский контекст — caption «свежий контекст = независимое суждение»; step 3 the nodes link into a graph.
  - Copy: 0 «Контекст конечен, а задачи — нет.» / 1 «Параллелизм: десять свежих контекстов вместо одного уставшего.» / 2 «Проверяющий, сидящий в контексте автора, наследует его слепые пятна.» / 3 «Единица работы теперь — не цикл, а граф циклов.»
- [ ] **Step 2: `18-determinism-split` — «код оркеструет, агенты судят», 3 steps, eyebrow «инженерия графов · 18».**
  - Visual: a workflow graph; step 0 the skeleton draws in solid strokes (square nodes: `for`, `if`, `fan-out`, `merge`) — mono labels, «это код, он детерминирован»; step 1 round agent nodes drop into slots and glow/pulse (stochastic); step 2 cost overlay: tiny token-coin icons appear only on round nodes.
  - Copy: 0 «Оркестрация — это обычный код: циклы, условия, fan-out.» / 1 «Агенты — только там, где нужно суждение.» / 2 «Токены тратим на мышление, не на маршрутизацию. Детерминизм — где можно…»
- [ ] **Step 3: `19-pipeline-barrier` — «pipeline против barrier», 4 steps, eyebrow «инженерия графов · 19».**
  - Visual: two lanes, same three stages (`найти` → `проверить` → `оформить`), four item-dots each with different speeds. Top «barrier»: dots wait at a fence until the slowest arrives — waiting dots blink mute, wasted idle time shown as a growing hatched bar. Bottom «pipeline» (step 1): fast dots flow ahead through stages independently — finish line reached visibly earlier; step 2 a wall-clock comparison bar: `barrier: ████████ / pipeline: █████`. Step 3 exception note: «barrier нужен, только когда стадии N нужно ВСЁ из стадии N−1 — например, дедупликация».
  - Copy: 0/1 describe lanes / 2 «Стены между стадиями — это простой быстрых задач.» / 3 exception.
- [ ] **Step 4: `20-adversarial` — «адверсариальная проверка», 5 steps, eyebrow «инженерия графов · 20».**
  - Visual: a finding card appears center: `«утечка соединений в pool.ts»` (accent border). Step 1: three skeptic nodes drop in around it, each labeled `опровергни` — prompts matter: they're told to *refute*. Step 2: verdict edges draw one by one: `✗ опровергнуто`, `✗ опровергнуто`, `✓ устояло` — card cracks (strikethrough + dissolve to 20% opacity). Step 3: a second finding card runs the same gauntlet and survives 3/3 → gets `confirmed` badge (cool). Step 4: punchline strip: «правдоподобное ≠ правда. Правдоподобный шиткод убивается только независимой попыткой его опровергнуть.»
  - Copy mirrors steps; keep beats short.
- [ ] **Step 5: `21-judge-dry` — «панель судей и цикл до сухого», 4 steps, eyebrow «инженерия графов · 21».**
  - Visual: split. Left «панель судей»: three candidate solution cards; three judge nodes score them (small numbers animate in); winner highlighted, a good idea from a loser card (small chip) grafts onto the winner. Right (step 2) «цикл до сухого»: rounds of a discovery loop shown as buckets: `раунд 1: 7 новых` → `раунд 2: 2 новых` → `раунд 3: 0` → `раунд 4: 0` → stop stamp. Counter of found issues climbs then plateaus.
  - Copy: 0 «Когда пространство решений широкое — генерируй N подходов и суди.» / 1 «Синтез: победитель + лучшие идеи проигравших.» / 2 «Когда размер задачи неизвестен — ищи, пока два раунда подряд не вернут ноль.» / 3 «Счётчик „нашли 10 — хватит“ пропускает хвост.»
- [ ] **Step 6: `22-schemas` — «схемы — типы графа», 3 steps, eyebrow «инженерия графов · 22».**
  - Visual: two agent nodes connected by a pipe with a shaped cross-section (a JSON schema card floats above: `{file, line, severity}`). Step 0 pipe + schema; step 1 a malformed blob (`«ну, в целом код неплохой…»`, prose-shaped) bounces off the pipe opening (spring physics feel via keyframes); step 2 a well-shaped packet (`{file: 'pool.ts', line: 42, severity: 'high'}`) glides through, lands as structured row.
  - Copy: 0 «Между стохастическими узлами нужны жёсткие контракты.» / 1 «Свободный текст между агентами — это untyped API.» / 2 «Схема валидируется на границе: не распарсилось — агент переделывает, а не граф падает.»
- [ ] **Step 7: `23-budget` — «ручка бюджета», 3 steps, eyebrow «инженерия графов · 23».**
  - Visual: a horizontal slider labeled `бюджет: 50k ────●──── 500k`; below it the same workflow graph. Step 0: slider left — graph renders small: 2 finders, 1 verifier. Step 1: slider animates right — graph grows in place: 6 finders, 3 skeptics per finding, judge stage appears. Step 2: label strip: `тщательность — параметр, а не переписывание`.
  - Copy: 0 «Быстрая проверка и глубокий аудит — один и тот же граф.» / 1 «Разница — положение ручки: сколько независимых взглядов купить.» / 2 «Цена мышления впервые стала настраиваемой. Пользуйся.»
- [ ] **Step 8: Register, verify, commit** — `"Add graph engineering slides (17-23)"`.

---

### Task 7: Agent-native team (slides 24–32)

**Files:**
- Create: `24-bottleneck.tsx`, `25-shift-left.tsx`, `26-review-to-lint.tsx`, `27-repo-prompt.tsx`, `28-trust-ladder.tsx`, `29-metrics.tsx`, `30-antipatterns.tsx`, `31-what-stays-human.tsx`, `32-role-shift.tsx`
- Modify: `src/slides/index.ts`

**Interfaces:** produces `bottleneckSlide`, `shiftLeftSlide`, `reviewToLintSlide`, `repoPromptSlide`, `trustLadderSlide`, `metricsSlide`, `antipatternsSlide`, `whatStaysHumanSlide`, `roleShiftSlide`.

- [ ] **Step 1: `24-bottleneck` — «бутылочное горлышко переехало», 4 steps, eyebrow «агентная команда · 24».**
  - Visual: a horizontal throughput pipe with sections `написать` → `отревьюить` → `смержить`; particle flow through it. Step 0: pre-agent widths, steady flow. Step 1: `написать` balloons wide (agents!), particles pile up at `отревьюить` which stays narrow — queue grows, warn tint, callback chip «тот самый MR на 700 строк» (slide 2 echo). Step 2: formula: `скорость команды = пропускная способность ревью`. Step 3: «расширять надо не написание. Его уже расширили за нас.»
  - Copy mirrors steps.
- [ ] **Step 2: `25-shift-left` — «валидация до человека», 5 steps, eyebrow «агентная команда · 25».**
  - Visual: an MR card travels a conveyor toward a human desk (right). Machine gates snap in ahead of the desk one per step: `lint` → `типы` → `тесты` → `само-ревью` (each a square gate, slide-13 visual language). MR bounces back at a red gate, loops (агент чинит), passes green; only then reaches the desk — human icon reviews a *small, pre-verified* diff with a `✓ проверено машиной` badge. Step 4 punchline: «Не тратьте человеческое ревью на то, что могла отклонить машина.»
  - Copy: 0 «Валидацию — внутрь цикла агента, до MR.» / 1–2 gates / 3 «Человеку достаётся суждение: архитектура, смысл, вкус.» / 4 punchline.
- [ ] **Step 3: `26-review-to-lint` — «комментарий → линтер», 4 steps, eyebrow «агентная команда · 26».**
  - Visual: a review comment bubble: `«мы не используем raw SQL в хендлерах»` appears with a `×3` counter (третий раз пишем!). Step 1: the bubble is forged — anvil-flash — into a rule card: `no-raw-sql-in-handlers` (mono, cool border) that slots into the gate wall from slide 25. Step 2: next MR with the violation hits the gate — caught *before* any human, agent fixes, `×0` counter. Step 3: aphorism: «каждый повторяющийся комментарий ревью — это недописанный линтер.»
  - Copy: 0 «Ты уже писал этот комментарий. Дважды.» / 1 «Вкус команды компилируется в инфраструктуру.» / 2 «Теперь это ловится до человека — и агент чинит сам.» / 3 aphorism.
- [ ] **Step 4: `27-repo-prompt` — «кодовая база — это промпт», 5 steps, eyebrow «агентная команда · 27».**
  - Visual: a repo tree card; elements light up one per step with a species-pair icon (человек+агент): `CLAUDE.md` («онбординг, который читают оба вида»), `маленькие модули` («влезает в контекст — и в голову»), `конвенции > остроумие`, `быстрые тесты` (`< 5 мин, иначе цикл агента стоит`), `песочница` («агент может запустить приложение»).
  - Copy: one beat per element; closing: «Всё это помогало и людям. Агенты просто сделали цену нечитаемости мгновенной.»
- [ ] **Step 5: `28-trust-ladder` — «лестница доверия», 5 steps, eyebrow «агентная команда · 28».**
  - Visual: four-rung ladder, each rung a card with a lock: `L0 подсказки` → `L1 правки под присмотром` → `L2 агент открывает MR` → `L3 авто-мерж для low-risk`. Locks open one per step (0–3) as a validation-stack meter beside the ladder grows (rungs from slide 8 stack up: тесты, линтеры, адверсариальное ревью). Step 4: annotation: «уровень выдаётся классу задач, а не агенту вообще. Открывает его зрелость валидации, не вайбы.»
  - Copy beats per rung; L3 example: «зависимости обновить, типовой CRUD — с прогоном полного стека проверок».
- [ ] **Step 6: `29-metrics` — «метрики, которые не врут», 4 steps, eyebrow «агентная команда · 29».**
  - Visual: two dashboard cards. Step 0 «театр» (left): big green `LOC ↑ 340%`, `PRs ↑ 210%` — confetti-adjacent, accent. Step 1 «правда» (right): `cycle time`, `итерации ревью на MR`, `revert rate`, `escaped defects` — small honest numbers, one of them warn (revert rate ↑). Step 2: theater card gets stamped `театр` diagonally (warn) and dims. Step 3: «Если правая карточка не улучшилась — агенты не ускорили команду. Что бы ни говорила левая.»
  - Copy mirrors.
- [ ] **Step 7: `30-antipatterns` — «галерея антипаттернов», 5 steps, eyebrow «агентная команда · 30».**
  - Visual: five museum-frame cards appear one per step, each an icon + name + one-liner: `prompt-and-pray` (кубик); `MR на 700 строк` (толстый диф); `штамп-ревью` (агент ревьюит агента без задачи опровергнуть — печать `LGTM` шлёпает сама); `театр скорости` (график LOC вверх, revert вверх); `контекст-марафон` (переполненный бар из слайда 11).
  - Copy: one line each, dry humor; final line: «все пять — не проблемы модели. Это дырки в обвязке.»
- [ ] **Step 8: `31-what-stays-human` — «что остаётся человеку», 4 steps, eyebrow «агентная команда · 31».**
  - Visual: quiet slide, mostly typography. Four items fade in: «вкус — что считать хорошим» / «архитектура — какие границы провести» / «продукт — что вообще строить» / «содержимое линтеров — сами правила пишет команда». Step 3: honest open question in a bordered card: «как растить джунов в команде, где типовую работу делает агент? — честный ответ: индустрия ещё не знает.»
  - Copy minimal — let the four items carry it.
- [ ] **Step 9: `32-role-shift` — «инженер среды», 3 steps, eyebrow «агентная команда · 32».**
  - Visual: the agent loop (small) with a human figure *inside* it (step 0); step 1 the figure steps out (animated x-translate) and grows, now standing beside a control panel of dials labeled `обратная связь`, `гейты`, `бюджет`, `граф`; step 2 title line lands: «ты больше не пишешь код. ты проектируешь систему, которая его пишет.»
  - Copy: 0 «В старой роли ты — внутри цикла: каждое изменение через твои руки.» / 1 «В новой — снаружи: ты проектируешь среду, циклы и гейты.» / 2 punchline echo.
- [ ] **Step 10: Register, verify, commit** — `"Add agent-native team slides (24-32)"`.

---

### Task 8: Close (33–34), final registration, polish pass

**Files:**
- Create: `33-monday.tsx`, `34-recap.tsx`
- Modify: `src/slides/index.ts` (final order: 01…35), root `README.md` (verify table entry from Task 1 still accurate)

**Interfaces:** produces `mondaySlide`, `recapSlide`; consumes `EraTimeline` with full arc.

- [ ] **Step 1: `33-monday` — «утро понедельника», 5 steps, eyebrow «финал · 33».**
  - Visual: checklist card, items check themselves in one per step (0–3): `1. напиши CLAUDE.md — 30 минут` / `2. тесты одной командой — make test` / `3. три последних review-комментария → lint-правила` / `4. один повторяющийся workflow → slash-команда`. Step 4: footer: «через месяц вернись к слайду про метрики.»
  - Copy: one encouraging beat: «Не нужен грант на платформу. Нужны четыре шага.»
- [ ] **Step 2: `34-recap` — «вся дуга», 7 steps, eyebrow «финал · 34».**
  - Visual: full-width `EraTimeline` (large variant — reuse component, scale via wrapper). Steps 0–5: the loop glyph replays its migration era by era; at each stop a principle chip stamps beneath: `чатбот → человек-harness` / `автокомплит → один выстрел без проверки` / `IDE-агент → генерация = поиск` / `harness → среда в цикле, рельсы` / `команды → промпт стал артефактом` / `графы → независимое суждение, детерминизм где можно`. Step 6: one-line takeaway centered: «скорость даёт не модель. Скорость даёт цикл обратной связи, который ты построил вокруг неё.»
- [ ] **Step 3: Final registration order check** — `index.ts` must list all 35 slides in numeric order; run the deck and arrow through every slide.
- [ ] **Step 4: Full verification**

```bash
cd chatbot-to-teammate && npm run build && npm run lint
```

Expected: both clean. Then `npm run dev` and manually step through all 35 slides forward *and* backward (reversibility check), at a narrow window too (~1280×720).

- [ ] **Step 5: Commit** — `"Add closing slides and complete chatbot-to-teammate deck"`.

---

## Self-review notes

- Spec coverage: all 35 spec slides have a task (T2: 01, 35; T3: 02–06; T4: 07–13; T5: 14–16; T6: 17–23; T7: 24–32; T8: 33–34). EraTimeline, README updates, and verification bar covered (T1, T2, T8).
- Cut order (if the hour runs long) lives in the spec; the plan builds all 35 — cutting is a presentation-time decision, not a build-time one.
- Interface consistency: all slides consume only `Slide`, `Build`, layout/typography components, and `EraTimeline` as defined in Task 2.
