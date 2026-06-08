import { motion } from "framer-motion";
import type { Slide } from "../deck/types";
import { Build } from "../deck/Build";
import { Eyebrow, SlideTitle, BodyText } from "../ui/SlideTitle";
import { Split, Stack } from "../ui/Layout";

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
            fill={isShared ? "var(--cool)" : isLit ? "var(--accent)" : "var(--bg-elev)"}
            stroke={isShared || isLit ? "none" : "var(--line)"}
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
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 560 }}>
      <defs>
        <marker id="arr2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink-soft)" />
        </marker>
      </defs>

      {/* ---------- DENSE: Gemma 4 ---------- */}
      <text x={0} y={20} fontFamily="var(--mono)" fontSize="10" letterSpacing="0.18em" fill="var(--cool)">
        ПЛОТНАЯ
      </text>
      <text
        x={W}
        y={20}
        textAnchor="end"
        fontFamily="var(--display)"
        fontStyle="italic"
        fontSize="18"
        fill="var(--cool)"
      >
        Gemma 4
      </text>
      <rect x={cx - 150} y={34} width={300} height={56} rx={6} fill="rgba(123, 214, 195, 0.16)" stroke="var(--cool)" />
      <text x={cx} y={59} textAnchor="middle" fontFamily="var(--mono)" fontSize="13" fill="var(--cool)">
        одна сеть — 31B
      </text>
      <text x={cx} y={77} textAnchor="middle" fontFamily="var(--mono)" fontSize="10.5" fill="var(--ink-mute)">
        каждый параметр срабатывает на каждый токен
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
      <text
        x={W}
        y={158}
        textAnchor="end"
        fontFamily="var(--display)"
        fontStyle="italic"
        fontSize="18"
        fill="var(--accent)"
      >
        Qwen 3.5
      </text>

      {/* router */}
      <rect x={cx - 50} y={176} width={100} height={30} rx={5} fill="var(--accent-soft)" stroke="var(--accent-line)" />
      <text x={cx} y={195} textAnchor="middle" fontFamily="var(--mono)" fontSize="12" fill="var(--accent)">
        роутер
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
              {twoUp && gridLabel("прогон 1", GRID_W)}
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
              {gridLabel("прогон 2 · промпт переформулирован", GRID_W)}
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
        срабатывают 11 из 512 экспертов · активны 17B из 397B
      </text>
      <g transform={`translate(${cx - 210}, 420)`}>
        <rect x={0} y={0} width={12} height={12} rx={2} fill="var(--cool)" />
        <text x={18} y={11} fontFamily="var(--mono)" fontSize="10.5" fill="var(--ink-mute)">
          общий (всегда включён)
        </text>
        <rect x={170} y={0} width={12} height={12} rx={2} fill="var(--accent)" />
        <text x={188} y={11} fontFamily="var(--mono)" fontSize="10.5" fill="var(--ink-mute)">
          маршрутизируемые (выбираются на токен)
        </text>
      </g>
      <text x={cx} y={462} textAnchor="middle" fontFamily="var(--mono)" fontSize="9.5" fill="var(--ink-mute)">
        сетка иллюстративна — у Qwen 3.5 512 экспертов; ~11 срабатывают на токен
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
          та же задача → срабатывают другие ~11
        </motion.text>
      )}
    </svg>
  );
}

export const denseVsMoeSlide: Slide = {
  id: "dense-vs-moe",
  title: "плотная vs MoE",
  totalSteps: 5,
  render: ({ step }) => (
    <Split
      ratio="1fr 1fr"
      left={
        <Stack gap={18}>
          <Eyebrow>модели · 16</Eyebrow>
          <SlideTitle size="md">Плотная модель все нейроны целиком. MoE выбирает комитет на каждый токен.</SlideTitle>
          <Stack gap={12} style={{ marginTop: 8 }}>
            <Build step={step} appearAt={0}>
              <BodyText size="sm">
                <span style={{ color: "var(--cool)" }}>Gemma 4</span> — <strong>плотная</strong>: все 31B параметров
                срабатывают на каждый токен. <span style={{ color: "var(--accent)" }}>Qwen 3.5</span> — это{" "}
                <strong>mixture of experts</strong>: 397B параметров, но роутер выбирает ~11 из 512 экспертов (
                <span style={{ color: "var(--ink)" }}>17B</span>) на токен.
              </BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText size="sm">
                <span style={{ color: "var(--accent)" }}>Рычаг 1 · активные вычисления.</span> Ты платишь — и «думаешь»
                — <em>активными</em> параметрами. 17B — это реальный бюджет на шаг: для любого отдельного шага это ближе
                к 17B-модели, чем к 397B.
              </BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText size="sm">
                <span style={{ color: "var(--accent)" }}>Рычаг 2 · роутинг — это рулетка.</span> Переформулируй промпт,
                подкинь скилл или просто запусти ещё раз — и задачу может подхватить другой комитет: до трети токенов
                перенаправляются ближе к концу обучения, и выбор может отличаться от прогона к прогону. Управляемость
                страдает.
              </BodyText>
            </Build>
            <Build step={step} appearAt={3}>
              <BodyText size="sm">
                <span style={{ color: "var(--accent)" }}>Рычаг 3 · агентный RL труднее на MoE.</span> Навык агента
                рождается из тяжёлого RL-постобучения; на MoE роутер дрейфует между обучением и инференсом, так что этот
                RL сложнее «приземлить». Передовые лаборатории тратят колоссальные усилия, чтобы его стабилизировать.
              </BodyText>
            </Build>
            <Build step={step} appearAt={4}>
              <BodyText size="sm">
                <span style={{ color: "var(--ink)" }}>Передовые модели — тоже MoE</span> — DeepSeek, GLM, Kimi и почти
                наверняка GPT-5.5 и Claude. Разрыв не в «sparse vs dense»; он в активных вычислениях, стабильности
                роутинга и агентном RL.
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ArchDiagram step={step} />
        </div>
      }
    />
  ),
};
