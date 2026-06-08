import type { Slide } from "../deck/types";
import { Build } from "../deck/Build";
import { Eyebrow, SlideTitle, BodyText } from "../ui/SlideTitle";
import { Stack } from "../ui/Layout";

const BLOCKS = [
  {
    name: "Детерминированные проверки",
    color: "var(--accent)",
    body: "линтеры, форматтеры, типы, тесты — быстрые, воспроизводимые, без модели в петле.",
    tag: "lint · format · types · test",
  },
  {
    name: "Гейты",
    color: "var(--cool)",
    body: "pre-commit хуки, CI, «не мёржить, пока не зелено» — ничего сомнительного не проходит молча.",
    tag: "pre-commit · CI · required checks",
  },
  {
    name: "Ad-hoc скрипты",
    color: "var(--ink)",
    body: "одноразовые проверялки и кодмоды под задачу — превращают размытое «сделай X» в «скрипт говорит: готово или нет».",
    tag: "verify.sh · codemod · assert",
  },
  {
    name: "Песочница и разрешения",
    color: "#d98a8a",
    body: "read-only по умолчанию, опасное — спросить, изоляция (worktree / контейнер) — ограничивает радиус поражения.",
    tag: "read-only · approve · worktree",
  },
];

function BlockCard({ b }: { b: (typeof BLOCKS)[number] }) {
  return (
    <div
      style={{
        padding: "16px 18px",
        background: "var(--bg-elev)",
        border: "1px solid var(--line)",
        borderLeft: `2px solid ${b.color}`,
        borderRadius: 4,
        height: "100%",
      }}
    >
      <div style={{ fontFamily: "var(--mono)", fontSize: 14, color: "var(--ink)", marginBottom: 8 }}>{b.name}</div>
      <div style={{ color: "var(--ink-soft)", fontSize: 14, lineHeight: 1.5, marginBottom: 12 }}>{b.body}</div>
      <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: b.color, letterSpacing: "0.04em" }}>{b.tag}</div>
    </div>
  );
}

export const harnessEngToolkitSlide: Slide = {
  id: "harness-eng-toolkit",
  title: "harness engineering · инструменты",
  totalSteps: 4,
  render: ({ step }) => (
    <div style={{ display: "grid", gridTemplateRows: "auto 1fr", height: "100%", gap: 22 }}>
      <Stack gap={10}>
        <Eyebrow>harness engineering · 02</Eyebrow>
        <SlideTitle size="md">Из чего собирают безопасную среду для агента.</SlideTitle>
        <BodyText>
          Ни один кусок не требует «умной» модели — это обычная инженерия, которая ловит ошибки до того, как они станут
          важными.
        </BodyText>
      </Stack>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridAutoRows: "1fr",
          gap: 16,
          alignContent: "start",
        }}
      >
        {BLOCKS.map((b, i) => (
          <Build key={b.name} step={step} appearAt={i} y={10}>
            <BlockCard b={b} />
          </Build>
        ))}
      </div>
    </div>
  ),
};
