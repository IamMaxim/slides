import { motion } from "framer-motion";
import type { Slide } from "../deck/types";
import { Build } from "../deck/Build";
import { Eyebrow, SlideTitle, BodyText } from "../ui/SlideTitle";
import { Stack } from "../ui/Layout";

const RESPONSIBILITIES = [
  {
    name: "Сборка промпта",
    detail:
      "Подбирает нужный системный промпт, вклеивает скиллы, форматирует схемы инструментов, включает предыдущие реплики.",
  },
  {
    name: "Выполнение инструментов",
    detail: "Парсит блоки tool_use, валидирует входы, запускает функцию, забирает результат.",
  },
  {
    name: "Состояние",
    detail: "Отслеживает историю разговора, прочитанные файлы, todo-списки, рабочую директорию проекта.",
  },
  {
    name: "Ретраи и ошибки",
    detail:
      "Разбирается с ошибками модели, rate-лимитами, сломанными вызовами инструментов — иногда молча, иногда прося модель всё починить.",
  },
  {
    name: "Разрешения",
    detail: "Спрашивает пользователя перед чем-либо разрушительным. Фильтрует, какие инструменты вообще доступны.",
  },
  {
    name: "Бюджет контекста",
    detail: "Следит за расходом токенов. Запускает компакцию, когда окно заполняется.",
  },
];

const LOOP_CODE = `# the harness loop, roughly

state = init()
while True:
    prompt = state.assemble_prompt()
    response = model.call(prompt, tools=state.tools)
    state.add(response)

    if response.has_tool_use():
        result = execute_tool(response.tool_use)
        state.add(result)
        continue

    return response.text  # done`;

export const harnessSlide: Slide = {
  id: "harness",
  title: "harness",
  totalSteps: 2,
  render: ({ step }) => (
    <div style={{ display: "grid", gridTemplateRows: "auto 1fr", height: "100%", gap: 20 }}>
      <Stack gap={12}>
        <Eyebrow>эволюция · 12</Eyebrow>
        <SlideTitle size="md">Harness — это рантайм, который крутит цикл.</SlideTitle>
        <BodyText>
          Можно думать о нём как о той части системы, которая не является моделью. Claude Code, Cursor, OpenAI Responses
          API, Nessy — это всё harness'ы.
        </BodyText>
      </Stack>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 40, alignItems: "start" }}>
        <div>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: 12,
            }}
          >
            за что отвечает harness
          </div>
          <Stack gap={8}>
            {RESPONSIBILITIES.map((r, i) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "160px 1fr",
                  gap: 16,
                  padding: "10px 14px",
                  borderLeft: "2px solid var(--accent-line)",
                  background: "var(--bg-elev)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 12,
                    color: "var(--ink)",
                  }}
                >
                  {r.name}
                </span>
                <span style={{ color: "var(--ink-soft)", fontSize: 14 }}>{r.detail}</span>
              </motion.div>
            ))}
          </Stack>
        </div>

        <Build step={step} appearAt={1}>
          <div>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--cool)",
                marginBottom: 12,
              }}
            >
              цикл в 10 строк
            </div>
            <pre
              style={{
                margin: 0,
                padding: 18,
                background: "var(--bg-elev)",
                border: "1px solid var(--line)",
                borderRadius: 6,
                fontFamily: "var(--mono)",
                fontSize: 13,
                color: "var(--ink-soft)",
                lineHeight: 1.55,
                whiteSpace: "pre",
              }}
            >
              {LOOP_CODE}
            </pre>
            <p
              style={{
                marginTop: 16,
                color: "var(--ink-soft)",
                fontSize: 14,
                lineHeight: 1.5,
              }}
            >
              Вот буквально и всё. Harness — это в основном «водопровод»; интеллект живёт в модели.
            </p>
          </div>
        </Build>
      </div>
    </div>
  ),
};
