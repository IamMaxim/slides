import { motion } from "framer-motion";
import type { Slide } from "../deck/types";
import { Build } from "../deck/Build";
import { Eyebrow, SlideTitle, BodyText } from "../ui/SlideTitle";
import { Split, Stack } from "../ui/Layout";

const STAGES = [
  { x: 110, label: "минуты", sub: "сегодня", dots: 1, showAt: 0, color: "var(--accent)" },
  { x: 300, label: "часы", sub: "уже появляется", dots: 5, showAt: 1, color: "var(--cool)" },
  { x: 480, label: "дни", sub: "фронтир", dots: 14, showAt: 2, color: "#d98a8a" },
];

function dotPositions(n: number, cx: number, baseY: number) {
  const pts: { x: number; y: number }[] = [];
  if (n === 1) return [{ x: cx, y: baseY - 30 }];
  const perRow = Math.ceil(Math.sqrt(n));
  let placed = 0;
  for (let r = 0; placed < n; r++) {
    const inRow = Math.min(perRow, n - placed);
    for (let c = 0; c < inRow; c++) {
      const x = cx + (c - (inRow - 1) / 2) * 15;
      const y = baseY - 24 - r * 15;
      pts.push({ x, y });
      placed++;
    }
  }
  return pts;
}

function HorizonDiagram({ step }: { step: number }) {
  const W = 560;
  const H = 360;
  const baseY = 250;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 560 }}>
      <defs>
        <marker id="hz-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink-mute)" />
        </marker>
      </defs>

      {/* axis */}
      <line x1={56} y1={baseY} x2={W - 36} y2={baseY} stroke="var(--ink-mute)" strokeWidth="1.2" markerEnd="url(#hz-arr)" />
      <text x={W - 36} y={baseY + 64} textAnchor="end" fontFamily="var(--mono)" fontSize="11" fill="var(--ink-mute)">
        горизонт автономии →
      </text>

      {STAGES.map((s) => (
        <motion.g key={s.label} initial={false} animate={{ opacity: step >= s.showAt ? 1 : 0.12 }} transition={{ duration: 0.4 }}>
          {/* tick */}
          <line x1={s.x} y1={baseY - 5} x2={s.x} y2={baseY + 5} stroke="var(--ink-soft)" strokeWidth="1.2" />
          {/* agent dots */}
          {dotPositions(s.dots, s.x, baseY).map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={4.2} fill={s.color} fillOpacity={0.85} />
          ))}
          {/* labels */}
          <text x={s.x} y={baseY + 24} textAnchor="middle" fontFamily="var(--mono)" fontSize="13" fill="var(--ink)">
            {s.label}
          </text>
          <text x={s.x} y={baseY + 40} textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill={s.color} letterSpacing="0.06em">
            {s.sub}
          </text>
        </motion.g>
      ))}

      {/* fleet caption */}
      <motion.g initial={false} animate={{ opacity: step >= 2 ? 1 : 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
        <text x={480} y={70} textAnchor="middle" fontFamily="var(--mono)" fontSize="11" fill="#d98a8a">
          фермы агентов
        </text>
      </motion.g>
    </svg>
  );
}

export const frontierFutureSlide: Slide = {
  id: "frontier-future",
  title: "куда это идёт",
  totalSteps: 4,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.15fr"
      left={
        <Stack gap={20}>
          <Eyebrow>фронтир · 03 · будущее</Eyebrow>
          <SlideTitle size="md">Фронтир: фермы агентов и долгий горизонт.</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>
                Сегодня суб-агенты живут минуты. Фронтир — часы и дни: агенты, ведущие задачу почти без присмотра.
              </BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>
                Агенты, управляющие <span style={{ color: "#d98a8a" }}>флотами агентов</span>: планируют, раздают,
                проверяют, мёржат — а человек читает отчёт утром.
              </BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>
                Открытые проблемы: <span style={{ color: "var(--ink)" }}>стоимость</span> (токены растут как дерево
                вызовов), накопление ошибок и <span style={{ color: "var(--ink)" }}>верификация</span> — кто проверяет
                проверяющих.
              </BodyText>
            </Build>
            <Build step={step} appearAt={3}>
              <BodyText>
                Ставка фронтира: интеллект остаётся в модели, но всё больше рычага переезжает в{" "}
                <span style={{ color: "var(--accent)" }}>оркестрацию</span> над ней — и в harness engineering вокруг.
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: "flex", justifyContent: "center" }}>
          <HorizonDiagram step={step} />
        </div>
      }
    />
  ),
};
