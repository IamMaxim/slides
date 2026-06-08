import { motion } from "framer-motion";
import type { Slide } from "../deck/types";
import { Build } from "../deck/Build";
import { Eyebrow, SlideTitle, BodyText } from "../ui/SlideTitle";
import { Split, Stack } from "../ui/Layout";

function VerifyLoop({ step }: { step: number }) {
  const W = 540;
  const H = 380;
  const agent = { x: 130, y: 110 };
  const check = { x: 410, y: 110 };
  const done = { x: 410, y: 300 };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 540 }}>
      <defs>
        <marker id="vl-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink-soft)" />
        </marker>
        <marker id="vl-arr-g" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--cool)" />
        </marker>
        <marker id="vl-arr-r" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#d98a8a" />
        </marker>
      </defs>

      {/* agent */}
      <circle cx={agent.x} cy={agent.y} r={46} fill="var(--bg-elev)" stroke="var(--accent)" strokeWidth="1.6" />
      <text x={agent.x} y={agent.y - 2} textAnchor="middle" fontFamily="var(--display)" fontStyle="italic" fontSize="17" fill="var(--accent)">
        агент
      </text>
      <text x={agent.x} y={agent.y + 16} textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill="var(--ink-mute)">
        меняет код
      </text>

      {/* check */}
      <rect x={check.x - 64} y={check.y - 32} width={128} height={64} rx={5} fill="var(--bg-elev)" stroke="var(--ink-soft)" strokeWidth="1.4" />
      <text x={check.x} y={check.y - 4} textAnchor="middle" fontFamily="var(--mono)" fontSize="12" fill="var(--ink)">
        проверка
      </text>
      <text x={check.x} y={check.y + 14} textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill="var(--ink-mute)">
        test · lint · script
      </text>

      {/* agent → check */}
      <line x1={agent.x + 46} y1={agent.y} x2={check.x - 66} y2={check.y} stroke="var(--ink-soft)" strokeWidth="1.3" markerEnd="url(#vl-arr)" />
      <text x={(agent.x + check.x) / 2} y={agent.y - 14} textAnchor="middle" fontFamily="var(--mono)" fontSize="11" fill="var(--ink-soft)">
        прогон
      </text>

      {/* red: back to agent */}
      <motion.g initial={false} animate={{ opacity: step >= 2 ? 1 : 0 }} transition={{ duration: 0.4 }}>
        <path
          d={`M ${check.x - 64} ${check.y + 18} C ${check.x - 150} ${check.y + 70}, ${agent.x + 40} ${agent.y + 78}, ${agent.x} ${agent.y + 48}`}
          fill="none"
          stroke="#d98a8a"
          strokeWidth="1.3"
          strokeDasharray="5 4"
          markerEnd="url(#vl-arr-r)"
        />
        <text x={(agent.x + check.x) / 2 - 6} y={check.y + 76} textAnchor="middle" fontFamily="var(--mono)" fontSize="11" fill="#d98a8a">
          красный → правь
        </text>
      </motion.g>

      {/* green: done */}
      <motion.g initial={false} animate={{ opacity: step >= 3 ? 1 : 0 }} transition={{ duration: 0.4 }}>
        <line x1={check.x} y1={check.y + 32} x2={done.x} y2={done.y - 30} stroke="var(--cool)" strokeWidth="1.5" markerEnd="url(#vl-arr-g)" />
        <text x={check.x + 14} y={(check.y + done.y) / 2} textAnchor="start" fontFamily="var(--mono)" fontSize="11" fill="var(--cool)">
          зелёно
        </text>
        <rect x={done.x - 60} y={done.y - 30} width={120} height={60} rx={5} fill="rgba(123, 214, 195, 0.10)" stroke="rgba(123, 214, 195, 0.45)" />
        <text x={done.x} y={done.y - 2} textAnchor="middle" fontFamily="var(--mono)" fontSize="13" fill="var(--cool)">
          готово ✓
        </text>
        <text x={done.x} y={done.y + 15} textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill="var(--ink-mute)">
          сигнал успеха
        </text>
      </motion.g>
    </svg>
  );
}

export const harnessEngVerifySlide: Slide = {
  id: "harness-eng-verify",
  title: "harness engineering · verifiable",
  totalSteps: 4,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.15fr"
      left={
        <Stack gap={20}>
          <Eyebrow>harness engineering · 03</Eyebrow>
          <SlideTitle size="md">Цель — сделать «готово» проверяемым машиной.</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>
                Лучший harness даёт агенту чёткий <span style={{ color: "var(--cool)" }}>сигнал успеха</span>: команду,
                которая возвращает «зелено» или «красно». Без неё агент не знает, когда остановиться.
              </BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>
                Поэтому работу формулируют как <em>verifiable</em>: есть тест, скрипт или линтер, который однозначно
                говорит, выполнено условие или нет.
              </BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>
                Тогда цикл закрывается сам: агент меняет код → гоняет проверку →{" "}
                <span style={{ color: "#d98a8a" }}>читает ошибку</span> → правит → повторяет.
              </BodyText>
            </Build>
            <Build step={step} appearAt={3}>
              <BodyText>
                Модель та же. Но среда превращает её недетерминированный вывод в предсказуемый, безопасный результат. Это
                и есть harness из прошлой части — только <span style={{ color: "var(--ink)" }}>спроектированный</span>.
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: "flex", justifyContent: "center" }}>
          <VerifyLoop step={step} />
        </div>
      }
    />
  ),
};
