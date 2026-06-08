import { motion } from "framer-motion";
import type { Slide } from "../deck/types";
import { Eyebrow, SlideTitle, BodyText } from "../ui/SlideTitle";
import { Stack } from "../ui/Layout";

type Row = {
  name: string;
  params: string;
  arch: string;
  agent: string;
  color: string;
  anchor?: boolean;
};

const ROWS: Row[] = [
  {
    name: "Claude Opus 4.8",
    params: "не раскрыто*",
    arch: "предполож. MoE",
    agent: "тяжёлый агентный RL; очень управляема в длинных циклах инструментов",
    color: "var(--ink-soft)",
  },
  {
    name: "GPT-5.5",
    params: "не раскрыто*",
    arch: "предполож. MoE",
    agent: "тяжёлый агентный RL; очень управляема",
    color: "var(--ink-soft)",
  },
  {
    name: "DeepSeek V4",
    params: "1.6T / 49B",
    arch: "MoE",
    agent: "большой активный бюджет; сильнейший открытый агент",
    color: "var(--ink-soft)",
  },
  {
    name: "GLM-5.1",
    params: "744B / 40B",
    arch: "MoE",
    agent: "сильная открытая модель для кода / агентов",
    color: "var(--ink-soft)",
  },
  {
    name: "Kimi K2.6",
    params: "1T / 32B",
    arch: "MoE",
    agent: "фокус на агентах с длинным горизонтом",
    color: "var(--ink-soft)",
  },
  {
    name: "Qwen 3.5",
    params: "397B / 17B",
    arch: "MoE · 512 экспертов",
    agent: "огромные знания, крошечный активный бюджет; сильная, но «прыгучая», трудно управлять",
    color: "var(--accent)",
    anchor: true,
  },
  {
    name: "Llama 4",
    params: "MoE (open)",
    arch: "MoE",
    agent: "открытая MoE; более лёгкий агентный RL",
    color: "var(--ink-soft)",
  },
  {
    name: "Gemma 4",
    params: "31B / 31B",
    arch: "плотная",
    agent: "маленькая, но полностью предсказуемая; срабатывает каждый параметр",
    color: "var(--ink-soft)",
  },
];

const GRID = "210px 150px 190px 1fr";

export const modelZooSlide: Slide = {
  id: "model-zoo",
  title: "зоопарк моделей",
  totalSteps: 1,
  render: () => (
    <div style={{ display: "grid", gridTemplateRows: "auto 1fr", height: "100%", gap: 14 }}>
      <Stack gap={6}>
        <Eyebrow>модели · 16a</Eyebrow>
        <SlideTitle size="sm">Зоопарк моделей 2026</SlideTitle>
        <BodyText size="sm">
          Почти всё на передовой сейчас — MoE, так что «MoE против плотных» — это не суть. Великих агентов отличают
          активный бюджет, стабильность роутинга и то, сколько в них вложено агентного RL.
        </BodyText>
      </Stack>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 6, alignContent: "start" }}>
        {/* header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: GRID,
            gap: 16,
            padding: "4px 14px",
            fontFamily: "var(--mono)",
            fontSize: 9,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--ink-mute)",
          }}
        >
          <span>модель</span>
          <span>всего / активно</span>
          <span>архитектура</span>
          <span>как агент</span>
        </div>

        {ROWS.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            style={{
              display: "grid",
              gridTemplateColumns: GRID,
              gap: 16,
              padding: "8px 14px",
              background: r.anchor ? "var(--accent-soft)" : "var(--bg-elev)",
              border: "1px solid var(--line)",
              borderLeft: `3px solid ${r.anchor ? r.color : "var(--line)"}`,
              borderRadius: 4,
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span
                style={{
                  fontFamily: "var(--display)",
                  fontStyle: "italic",
                  fontSize: 18,
                  color: r.color,
                  lineHeight: 1.1,
                  fontWeight: 300,
                }}
              >
                {r.name}
              </span>
              {r.anchor && (
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 8.5,
                    color: "var(--ink-mute)",
                    letterSpacing: "0.08em",
                  }}
                >
                  ◀ пред. слайд
                </span>
              )}
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 11.5, color: "var(--ink)", letterSpacing: "0.04em" }}>
              {r.params}
            </div>
            <div
              style={{ fontFamily: "var(--mono)", fontSize: 11.5, color: "var(--ink-soft)", letterSpacing: "0.04em" }}
            >
              {r.arch}
            </div>
            <div style={{ color: "var(--ink-soft)", fontSize: 12.5, lineHeight: 1.4 }}>{r.agent}</div>
          </motion.div>
        ))}

        <div
          style={{
            marginTop: 6,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          <div
            style={{
              padding: "9px 14px",
              border: "1px dashed var(--line)",
              borderRadius: 4,
              fontFamily: "var(--mono)",
              fontSize: 11,
              color: "var(--ink-mute)",
              lineHeight: 1.45,
            }}
          >
            <span style={{ color: "var(--accent)" }}>почему Claude и GPT выигрывают как агенты.</span> Не потому, что
            они плотные — почти наверняка тоже MoE. Больший активный бюджет + стабилизированный роутинг + куда больше
            агентного RL держат поведение стабильным при переформулированных промптах, подкинутых скиллах и длинных
            циклах инструментов.
          </div>
          <div
            style={{
              padding: "9px 14px",
              border: "1px dashed var(--line)",
              borderRadius: 4,
              fontFamily: "var(--mono)",
              fontSize: 11,
              color: "var(--ink-mute)",
              lineHeight: 1.45,
            }}
          >
            <span style={{ color: "var(--cool)" }}>как открытые модели сокращают разрыв.</span> Бо́льшие активные бюджеты
            или общие/всегда-включённые эксперты (меньше рулетки), стабилизация роутера (детерминированный / основанный
            на распределении роутинг; согласовать роутеры на обучении и инференсе) и куда больше агентного RL — а не
            больше сырых параметров.
          </div>
        </div>

        <div
          style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-mute)", marginTop: 2, paddingLeft: 14 }}
        >
          *внутренности моделей с закрытыми весами не публичны — MoE предполагается, а не подтверждено.
        </div>
      </div>
    </div>
  ),
};
