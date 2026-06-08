import { motion } from "framer-motion";
import type { Slide } from "../deck/types";
import { Build } from "../deck/Build";
import { Eyebrow, SlideTitle, BodyText } from "../ui/SlideTitle";
import { Split, Stack } from "../ui/Layout";

const GATES = ["lint", "types", "tests", "gate"];

function GauntletDiagram({ step }: { step: number }) {
  const W = 760;
  const H = 380;
  const agent = { x: 84, y: 130 };
  const merge = { x: W - 84, y: 130 };
  const gateXs = [212, 312, 412, 512];
  const gateY = 130;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 680 }}>
      <defs>
        <marker id="geng-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink-soft)" />
        </marker>
        <marker id="geng-arr-g" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--cool)" />
        </marker>
        <marker id="geng-arr-r" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#d98a8a" />
        </marker>
      </defs>

      {/* agent */}
      <circle cx={agent.x} cy={agent.y} r={42} fill="var(--bg-elev)" stroke="var(--accent)" strokeWidth="1.6" />
      <text x={agent.x} y={agent.y - 3} textAnchor="middle" fontFamily="var(--display)" fontStyle="italic" fontSize="16" fill="var(--accent)">
        агент
      </text>
      <text x={agent.x} y={agent.y + 15} textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill="var(--ink-mute)">
        изменение
      </text>

      {/* gates */}
      <motion.g initial={false} animate={{ opacity: step >= 1 ? 1 : 0.12 }} transition={{ duration: 0.4 }}>
        <line x1={agent.x + 44} y1={gateY} x2={gateXs[0] - 30} y2={gateY} stroke="var(--ink-soft)" strokeWidth="1.2" markerEnd="url(#geng-arr)" />
        {gateXs.map((gx, i) => (
          <g key={GATES[i]}>
            <rect x={gx - 30} y={gateY - 20} width={60} height={40} rx={4} fill="var(--bg-elev)" stroke="var(--line)" strokeWidth="1.2" />
            <text x={gx} y={gateY + 4} textAnchor="middle" fontFamily="var(--mono)" fontSize="11" fill="var(--ink)">
              {GATES[i]}
            </text>
            {i < gateXs.length - 1 && (
              <line x1={gx + 30} y1={gateY} x2={gateXs[i + 1] - 30} y2={gateY} stroke="var(--ink-soft)" strokeWidth="1.2" markerEnd="url(#geng-arr)" />
            )}
          </g>
        ))}
      </motion.g>

      {/* green pass → merge */}
      <motion.g initial={false} animate={{ opacity: step >= 2 ? 1 : 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
        <line x1={gateXs[3] + 30} y1={gateY} x2={merge.x - 34} y2={gateY} stroke="var(--cool)" strokeWidth="1.5" markerEnd="url(#geng-arr-g)" />
        <rect x={merge.x - 34} y={gateY - 22} width={68} height={44} rx={4} fill="rgba(123, 214, 195, 0.10)" stroke="rgba(123, 214, 195, 0.45)" />
        <text x={merge.x} y={gateY - 1} textAnchor="middle" fontFamily="var(--mono)" fontSize="11" fill="var(--cool)">
          merge
        </text>
        <text x={merge.x} y={gateY + 14} textAnchor="middle" fontFamily="var(--mono)" fontSize="9.5" fill="var(--ink-mute)">
          зелёно
        </text>
      </motion.g>

      {/* red feedback loop */}
      <motion.g initial={false} animate={{ opacity: step >= 3 ? 1 : 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
        <path
          d={`M ${gateXs[1]} ${gateY + 22} C ${gateXs[1]} ${H - 70}, ${agent.x} ${H - 70}, ${agent.x} ${agent.y + 46}`}
          fill="none"
          stroke="#d98a8a"
          strokeWidth="1.3"
          strokeDasharray="5 4"
          markerEnd="url(#geng-arr-r)"
        />
        <text x={(gateXs[1] + agent.x) / 2} y={H - 52} textAnchor="middle" fontFamily="var(--mono)" fontSize="11" fill="#d98a8a">
          красный → фидбек
        </text>
      </motion.g>
    </svg>
  );
}

export const harnessEngWhySlide: Slide = {
  id: "harness-eng-why",
  title: "harness engineering",
  totalSteps: 4,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.25fr"
      left={
        <Stack gap={20}>
          <Eyebrow>harness engineering · 01</Eyebrow>
          <SlideTitle size="md">Не доверяй модели — построй среду, которая её проверяет.</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>
                Модель недетерминирована: иногда блестит, иногда ошибается. Идеальной её не сделать — но можно сделать
                предсказуемой <em>среду</em> вокруг неё.
              </BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>
                <span style={{ color: "var(--accent)" }}>Harness engineering</span> — это обвязка вокруг агента: линтеры,
                тесты, типы, гейты, ad-hoc скрипты. Дешёвые детерминированные проверки.
              </BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>
                Каждая проверка превращает «надеюсь, модель не ошиблась» в «машина поймает, если ошиблась». Ошибка
                ловится автоматически, а не в проде.
              </BodyText>
            </Build>
            <Build step={step} appearAt={3}>
              <BodyText>
                И те же проверки <span style={{ color: "#d98a8a" }}>дают модели обратную связь</span>: упавший тест,
                ошибка линтера, тип не сошёлся — сигнал, по которому агент сам себя чинит в цикле.
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: "flex", justifyContent: "center" }}>
          <GauntletDiagram step={step} />
        </div>
      }
    />
  ),
};
