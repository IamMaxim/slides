import { motion } from "framer-motion";
import type { Slide } from "../deck/types";
import { Build } from "../deck/Build";
import { Eyebrow, SlideTitle, BodyText } from "../ui/SlideTitle";
import { Split, Stack } from "../ui/Layout";

function OrchestratorDiagram({ step }: { step: number }) {
  const W = 580;
  const H = 440;
  const orch = { x: W / 2, y: 86 };
  const workerY = 320;
  const workerXs = [110, 290, 470];

  function Worker({ x, i }: { x: number; i: number }) {
    return (
      <motion.g initial={false} animate={{ opacity: step >= 1 ? 1 : 0, scale: step >= 1 ? 1 : 0.9 }} transition={{ duration: 0.35, delay: 0.05 * i }}>
        <circle cx={x} cy={workerY} r={40} fill="var(--bg-elev)" stroke="var(--cool)" strokeWidth="1.4" />
        <text x={x} y={workerY - 2} textAnchor="middle" fontFamily="var(--display)" fontStyle="italic" fontSize="14" fill="var(--cool)">
          воркер
        </text>
        <text x={x} y={workerY + 15} textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill="var(--ink-mute)">
          свой контекст
        </text>
      </motion.g>
    );
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 580 }}>
      <defs>
        <marker id="fr-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
        </marker>
        <marker id="fr-arr-c" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--cool)" />
        </marker>
      </defs>

      {/* spawn arrows */}
      <motion.g initial={false} animate={{ opacity: step >= 1 ? 1 : 0 }} transition={{ duration: 0.35 }}>
        {workerXs.map((x, i) => (
          <line key={i} x1={orch.x + (x - orch.x) * 0.16} y1={orch.y + 40} x2={x} y2={workerY - 44} stroke="var(--accent)" strokeWidth="1.2" markerEnd="url(#fr-arr)" />
        ))}
        <text x={orch.x - 150} y={(orch.y + workerY) / 2 - 6} textAnchor="middle" fontFamily="var(--mono)" fontSize="11" fill="var(--accent)">
          spawn_agent(задача)
        </text>
      </motion.g>

      {/* result arrows back */}
      <motion.g initial={false} animate={{ opacity: step >= 2 ? 1 : 0 }} transition={{ duration: 0.35, delay: 0.1 }}>
        {workerXs.map((x, i) => (
          <line key={i} x1={x + 18} y1={workerY - 44} x2={orch.x + (x - orch.x) * 0.16 + 18} y2={orch.y + 40} stroke="var(--cool)" strokeWidth="1.1" strokeOpacity={0.8} markerEnd="url(#fr-arr-c)" />
        ))}
        <text x={orch.x + 150} y={(orch.y + workerY) / 2 - 6} textAnchor="middle" fontFamily="var(--mono)" fontSize="11" fill="var(--cool)">
          только результат
        </text>
      </motion.g>

      {/* orchestrator */}
      <circle cx={orch.x} cy={orch.y} r={48} fill="var(--accent-soft)" stroke="var(--accent-line)" strokeWidth="1.7" />
      <text x={orch.x} y={orch.y - 3} textAnchor="middle" fontFamily="var(--display)" fontStyle="italic" fontSize="17" fill="var(--accent)">
        оркестратор
      </text>
      <text x={orch.x} y={orch.y + 16} textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill="var(--ink-mute)">
        держит план
      </text>

      {workerXs.map((x, i) => (
        <Worker key={i} x={x} i={i} />
      ))}

      {/* annotation */}
      <motion.g initial={false} animate={{ opacity: step >= 3 ? 1 : 0 }} transition={{ duration: 0.4 }}>
        <text x={W / 2} y={H - 18} textAnchor="middle" fontFamily="var(--mono)" fontSize="12" fill="var(--ink-soft)" letterSpacing="0.04em">
          суб-агент = ещё один инструмент
        </text>
      </motion.g>
    </svg>
  );
}

export const frontierAgentsSlide: Slide = {
  id: "frontier-agents",
  title: "агенты, управляющие агентами",
  totalSteps: 4,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.25fr"
      left={
        <Stack gap={20}>
          <Eyebrow>фронтир · 01</Eyebrow>
          <SlideTitle size="md">Агенты, управляющие агентами.</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>
                До сих пор был один цикл: одна модель, один контекст. Но окно конечно, а задачи бывают большими.
              </BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>
                Идея: пусть агент запускает <span style={{ color: "var(--cool)" }}>суб-агентов</span> и обращается с ними
                как с инструментами — <span style={{ color: "var(--accent)" }}>spawn_agent(задача)</span> вместо
                read_file.
              </BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>
                Зачем: параллелизм (много воркеров сразу), свежий контекст у каждого (не засоряют главное окно),
                разделение ролей.
              </BodyText>
            </Build>
            <Build step={step} appearAt={3}>
              <BodyText>
                <span style={{ color: "var(--accent)" }}>Оркестратор</span> держит план; воркеры делают узкие куски и
                возвращают наверх только результат — не весь свой шумный контекст.
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: "flex", justifyContent: "center" }}>
          <OrchestratorDiagram step={step} />
        </div>
      }
    />
  ),
};
