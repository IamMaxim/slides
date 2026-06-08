import { motion } from "framer-motion";
import type { Slide } from "../deck/types";
import { Build } from "../deck/Build";
import { Eyebrow, SlideTitle, BodyText } from "../ui/SlideTitle";
import { Split, Stack } from "../ui/Layout";

const COMPLETION = `Жил-был любопытный инженер, которому хотелось понять, как работают языковые модели. Он открыл блокнот и начал с того, что`;

const TEMPLATED = [
  { role: "system", text: "Ты полезный и немногословный ассистент." },
  { role: "user", text: "Что видит LLM, когда я отправляю сообщение в чат?" },
  { role: "assistant", text: "Последовательность токенов с маркерами ролей вокруг каждой реплики." },
  { role: "user", text: "Покажи пример." },
];

function CompletionView() {
  return (
    <div
      style={{
        padding: 18,
        background: "var(--bg-elev)",
        border: "1px solid var(--line)",
        borderRadius: 6,
        fontFamily: "var(--mono)",
        fontSize: 14,
        lineHeight: 1.6,
        color: "var(--ink-soft)",
        minHeight: 200,
      }}
    >
      <span>{COMPLETION}</span>
      <motion.span
        animate={{ opacity: [1, 0.1, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
        style={{ color: "var(--accent)" }}
      >
        ▍
      </motion.span>
    </div>
  );
}

function roleColor(role: string) {
  return role === "system" ? "var(--ink-mute)" : role === "user" ? "var(--cool)" : "var(--accent)";
}

function TemplateView({ multiTurn }: { multiTurn: boolean }) {
  const turns = multiTurn ? TEMPLATED : TEMPLATED.slice(0, 2);
  return (
    <div
      style={{
        padding: 16,
        background: "var(--bg-elev)",
        border: "1px solid var(--line)",
        borderRadius: 6,
        fontFamily: "var(--mono)",
        fontSize: 13,
        lineHeight: 1.6,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {turns.map((t, i) => {
        const color = roleColor(t.role);
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
          >
            <span style={{ color, fontWeight: 600 }}>{`<${t.role}>`}</span>
            <span style={{ color: "var(--ink-soft)" }}>{t.text}</span>
            <span style={{ color, fontWeight: 600 }}>{`</${t.role}>`}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

export const chatSlide: Slide = {
  id: "chat",
  title: "completion → чат",
  totalSteps: 3,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.1fr"
      left={
        <Stack gap={20}>
          <Eyebrow>эволюция · 09</Eyebrow>
          <SlideTitle size="md">Чат — это тот же цикл, просто с оберткой.</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>
                Изначально LLM просто продолжали любой текст, который ты ей давал. Подкинь <em>«Жил-был…»</em> — и
                модель пишет историю.
              </BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>
                Для чата мы оборачиваем каждую реплику в специальные{" "}
                <span style={{ color: "var(--accent)" }}>маркеры ролей</span>, зашитые в обучающие данные — system,
                user, assistant. Модель учится переключать поведение в зависимости от того, какую роль она сейчас
                дописывает.
              </BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>
                «Разговор» — это просто одна длинная последовательность токенов с этими маркерами между ними. Каждое
                новое сообщение пользователя продлевает ту же последовательность; модель заполняет следующую реплику
                assistant.
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <Stack gap={16}>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: step >= 1 ? "var(--ink-mute)" : "var(--accent)",
              transition: "color 300ms",
            }}
          >
            {step >= 1 ? "было: сырой completion" : "сырой completion"}
          </div>
          <div style={{ opacity: step >= 1 ? 0.45 : 1, transition: "opacity 300ms" }}>
            <CompletionView />
          </div>

          <Build step={step} appearAt={1}>
            <div>
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  marginBottom: 10,
                }}
              >
                с chat-шаблоном
              </div>
              <TemplateView multiTurn={step >= 2} />
            </div>
          </Build>
        </Stack>
      }
    />
  ),
};
