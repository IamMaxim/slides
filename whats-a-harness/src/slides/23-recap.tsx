import { motion } from "framer-motion";
import type { Slide } from "../deck/types";
import { Eyebrow, SlideTitle } from "../ui/SlideTitle";
import { Stack } from "../ui/Layout";

const TOPICS: { idx: number; n: string; t: string; sub: string }[] = [
  { idx: 1, n: "01", t: "Нейрон", sub: "крошечная взвешенная сумма + активация" },
  { idx: 2, n: "02", t: "Сеть", sub: "сложи в стопку — получишь аппроксиматор функций" },
  { idx: 3, n: "03", t: "Блок трансформера", sub: "attention + feed-forward, с residual-связями" },
  { idx: 4, n: "04", t: "LLM", sub: "эмбеддинг → N блоков → unembed → распределение" },
  { idx: 5, n: "05", t: "Токены", sub: "что модель на самом деле читает" },
  { idx: 6, n: "06", t: "Токенизатор", sub: "как текст становится ID" },
  { idx: 7, n: "07", t: "Attention", sub: "токены смотрят друг на друга; Q · K · V" },
  { idx: 9, n: "08", t: "Цикл следующего токена", sub: "единственный трюк модели" },
  { idx: 10, n: "09", t: "Чат", sub: "маркеры ролей вокруг реплик" },
  { idx: 11, n: "10", t: "Инструменты", sub: "модель пишет JSON, harness выполняет" },
  { idx: 12, n: "11", t: "Цикл агента", sub: "модель ↔ инструменты ↔ мир" },
  { idx: 13, n: "12", t: "Harness", sub: "рантайм, который крутит цикл" },
  { idx: 14, n: "13", t: "MCP", sub: "один протокол для подключения инструментов" },
  { idx: 17, n: "14", t: "Компакция", sub: "как конечное окно продолжает жить" },
  { idx: 18, n: "15", t: "Без обучения", sub: "веса заморожены — агенты не обновляются" },
  { idx: 19, n: "16", t: "Память", sub: "внешние файлы, пишутся вызовами инструментов" },
  { idx: 20, n: "17", t: "Подходы к памяти", sub: "заметки · авто · черновик · RAG" },
  { idx: 21, n: "18", t: "Системные промпты", sub: "слои инструкций, по приоритету" },
  { idx: 22, n: "19", t: "Скиллы", sub: "инструкции, грузятся по запросу" },
  { idx: 23, n: "20", t: "Плотная vs MoE", sub: "все параметры или комитет на токен" },
  { idx: 24, n: "21", t: "Зоопарк моделей", sub: "кто хорошо управляется как агент — и почему" },
  { idx: 25, n: "22", t: "Harness engineering", sub: "среда из проверок, гейтов и скриптов" },
  { idx: 28, n: "23", t: "Фронтир", sub: "агенты, управляющие агентами" },
];

export const recapSlide: Slide = {
  id: "recap",
  title: "итоги",
  totalSteps: 1,
  render: () => (
    <div style={{ display: "grid", gridTemplateRows: "auto 1fr auto", height: "100%", gap: 16 }}>
      <Stack gap={8}>
        <Eyebrow>Конетс · 23</Eyebrow>
        <SlideTitle size="md">Overview</SlideTitle>
      </Stack>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10,
          alignContent: "start",
        }}
      >
        {TOPICS.map((tp, i) => (
          <motion.a
            key={tp.n}
            href={`#${tp.idx}/0`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.02 }}
            style={{
              display: "block",
              padding: "8px 13px",
              background: "var(--bg-elev)",
              border: "1px solid var(--line)",
              borderRadius: 4,
              textDecoration: "none",
              color: "inherit",
              transition: "border 200ms, transform 200ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-line)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--line)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: "0.18em",
                color: "var(--accent)",
              }}
            >
              {tp.n}
            </div>
            <div
              style={{
                fontFamily: "var(--display)",
                fontStyle: "italic",
                fontSize: 17,
                fontWeight: 300,
                color: "var(--ink)",
                marginTop: 2,
                lineHeight: 1.1,
              }}
            >
              {tp.t}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--ink-mute)",
                marginTop: 2,
                lineHeight: 1.3,
              }}
            >
              {tp.sub}
            </div>
          </motion.a>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontFamily: "var(--mono)",
          fontSize: 12,
          color: "var(--ink-mute)",
        }}
      >
        <span
          style={{
            width: 40,
            height: 1,
            background: "var(--ink-mute)",
          }}
        />
        кликни на плитку, чтобы вернуться · нажми 0 для титульного слайда
      </div>
    </div>
  ),
};
