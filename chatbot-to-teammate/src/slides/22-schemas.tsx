import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

const W = 580;
const H = 500;

const AGENT_R = 40;
const A = { cx: 290, cy: 66 };
const B = { cx: 290, cy: 424 };

/** The boundary: a wall right across the graph with exactly one opening in it.
 *  Everything on this slide is an argument about the width of that opening. */
const PLATE_Y = 250;
const PLATE_H = 16;
const SLOT_L = 225;
const SLOT_R = 355;
const PLATE_OUT_L = 20;
const PLATE_OUT_R = 560;

const PIPE_BOTTOM = 372;

/**
 * Prose, drawn the way prose is shaped: no edges, no fields, ~184 wide against
 * a 130-wide opening. Centred on x≈285 so the label sits inside the lumps.
 */
const BLOB_PATH = `M 200 4
  C 193 -7, 205 -18, 224 -17
  C 231 -27, 258 -30, 273 -24
  C 288 -31, 319 -29, 327 -18
  C 349 -22, 369 -12, 364 0
  C 377 7, 369 19, 349 20
  C 338 28, 308 30, 295 24
  C 276 30, 246 28, 238 19
  C 214 21, 193 15, 200 4 Z`;
const BLOB_CX = 285;
const BLOB_REST = 152;
const BLOB_HIT = 214;
const BLOB_Y = [BLOB_REST, BLOB_HIT, BLOB_REST, BLOB_REST];
const BLOB_T = [0, 0.42, 0.72, 1];

const PACKET_W = 118;
const PACKET_H = 28;
const PACKET_Y = [122, 122, 356, 356];
/** Never fully absent: the packet is the argument, so it stays on screen and
 *  only dims at the ends of its run. */
const PACKET_O = [0.2, 1, 1, 0.2];
const PACKET_T = [0, 0.06, 0.86, 1];

const ROW = { x: 12, y: 392, w: 184, h: 64 };
const ROWS = ['file: pool.ts', 'line: 42', 'severity: high'];

function AgentNode({ cx, cy, label, sub, color }: { cx: number; cy: number; label: string; sub: string; color: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={AGENT_R} fill="var(--bg-elev)" stroke={color} strokeWidth="1.5" />
      <text
        x={cx}
        y={cy - 2}
        textAnchor="middle"
        fontFamily="var(--display)"
        fontStyle="italic"
        fontSize="16"
        fill={color}
      >
        {label}
      </text>
      <text
        x={cx}
        y={cy + 16}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="9"
        fill="var(--ink-mute)"
        letterSpacing="0.04em"
      >
        {sub}
      </text>
    </g>
  );
}

function SchemaDiagram({ step }: { step: number }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 620 }}>
      <defs>
        <marker id="s22-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--line)" />
        </marker>
      </defs>

      <AgentNode cx={A.cx} cy={A.cy} label="агент A" sub="находит" color="var(--accent)" />
      <AgentNode cx={B.cx} cy={B.cy} label="агент B" sub="чинит" color="var(--cool)" />

      {/* ---- the pipe below the boundary ---- */}
      <line x1={SLOT_L} y1={PLATE_Y + PLATE_H} x2={SLOT_L} y2={PIPE_BOTTOM} stroke="var(--cool)" strokeWidth="1.5" />
      <line x1={SLOT_R} y1={PLATE_Y + PLATE_H} x2={SLOT_R} y2={PIPE_BOTTOM} stroke="var(--cool)" strokeWidth="1.5" />
      <line
        x1={B.cx}
        y1={PIPE_BOTTOM}
        x2={B.cx}
        y2={B.cy - AGENT_R - 4}
        stroke="var(--cool)"
        strokeWidth="1.2"
        markerEnd="url(#s22-arr)"
      />

      {/* ---- the boundary plate: a hard opening with one shape ---- */}
      <rect x={PLATE_OUT_L} y={PLATE_Y} width={SLOT_L - PLATE_OUT_L} height={PLATE_H} fill="var(--cool)" opacity="0.85" />
      <rect x={SLOT_R} y={PLATE_Y} width={PLATE_OUT_R - SLOT_R} height={PLATE_H} fill="var(--cool)" opacity="0.85" />
      <text
        x={PLATE_OUT_L}
        y={PLATE_Y + 30}
        fontFamily="var(--mono)"
        fontSize="10"
        fill="var(--ink-mute)"
        letterSpacing="0.08em"
      >
        граница
      </text>

      {/* ---- the contract, naming the opening it cut ---- */}
      <rect
        x={392}
        y={150}
        width={176}
        height={58}
        rx={5}
        fill="var(--accent-soft)"
        stroke="var(--accent-line)"
        strokeWidth="1"
      />
      <text x={404} y={170} fontFamily="var(--mono)" fontSize="9" fill="var(--ink-mute)" letterSpacing="0.12em">
        СХЕМА
      </text>
      <text x={404} y={192} fontFamily="var(--mono)" fontSize="11" fill="var(--accent)" letterSpacing="0.02em">
        {'{file, line, severity}'}
      </text>
      <line
        x1={412}
        y1={208}
        x2={SLOT_R + 2}
        y2={PLATE_Y}
        stroke="var(--accent-line)"
        strokeWidth="1"
        strokeDasharray="3 4"
      />

      {/* ---- step 1: prose arrives and bounces ---- */}
      <motion.g initial={false} animate={{ opacity: step === 1 ? 1 : 0 }} transition={{ duration: 0.4 }}>
        <motion.g
          // ambient: initial = first keyframe, else a prod build never starts the loop
          initial={{ y: BLOB_Y[0] }}
          animate={{ y: BLOB_Y }}
          transition={{
            duration: 2.2,
            times: BLOB_T,
            repeat: Infinity,
            repeatDelay: 0.5,
            ease: [0.4, 0, 0.4, 1],
          }}
        >
          <path
            d={BLOB_PATH}
            fill="color-mix(in srgb, var(--warn) 12%, transparent)"
            stroke="var(--warn)"
            strokeWidth="1.3"
          />
          <text
            x={BLOB_CX}
            y={-4}
            textAnchor="middle"
            fontFamily="var(--display)"
            fontStyle="italic"
            fontSize="13"
            fill="var(--warn)"
          >
            «ну, в целом
          </text>
          <text
            x={BLOB_CX}
            y={15}
            textAnchor="middle"
            fontFamily="var(--display)"
            fontStyle="italic"
            fontSize="13"
            fill="var(--warn)"
          >
            код неплохой…»
          </text>
        </motion.g>
        <motion.g
          // ambient: initial = first keyframe, else a prod build never starts the loop
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 0.9, 0, 0] }}
          transition={{
            duration: 2.2,
            times: [0, 0.38, 0.46, 0.58, 1],
            repeat: Infinity,
            repeatDelay: 0.5,
            ease: 'linear',
          }}
        >
          <g stroke="var(--warn)" strokeWidth="2" strokeLinecap="round">
            <line x1={136} y1={226} x2={160} y2={246} />
            <line x1={160} y1={226} x2={136} y2={246} />
          </g>
        </motion.g>
        <text x={20} y={300} fontFamily="var(--mono)" fontSize="10" fill="var(--warn)" letterSpacing="0.04em">
          не распарсилось → переделывай
        </text>
      </motion.g>

      {/* ---- step 2: a packet the boundary was built for ---- */}
      <motion.g initial={false} animate={{ opacity: step >= 2 ? 1 : 0 }} transition={{ duration: 0.4 }}>
        <motion.g
          // ambient: initial = first keyframe, else a prod build never starts the loop
          initial={{ y: PACKET_Y[0], opacity: PACKET_O[0] }}
          animate={{ y: PACKET_Y, opacity: PACKET_O }}
          transition={{
            duration: 2.8,
            times: PACKET_T,
            repeat: Infinity,
            repeatDelay: 0.7,
            ease: 'linear',
          }}
        >
          <rect
            x={290 - PACKET_W / 2}
            y={-PACKET_H / 2}
            width={PACKET_W}
            height={PACKET_H}
            rx={3}
            fill="color-mix(in srgb, var(--cool) 18%, var(--bg-elev))"
            stroke="var(--cool)"
            strokeWidth="1.4"
          />
          <text
            x={290}
            y={4}
            textAnchor="middle"
            fontFamily="var(--mono)"
            fontSize="11"
            fill="var(--cool)"
            letterSpacing="0.02em"
          >
            pool.ts:42 high
          </text>
        </motion.g>

        <text x={ROW.x} y={ROW.y - 10} fontFamily="var(--mono)" fontSize="9" fill="var(--ink-mute)" letterSpacing="0.1em">
          РАЗОБРАННАЯ СТРОКА
        </text>
        <rect
          x={ROW.x}
          y={ROW.y}
          width={ROW.w}
          height={ROW.h}
          rx={5}
          fill="var(--bg-elev)"
          stroke="var(--cool)"
          strokeWidth="1.2"
        />
        {ROWS.map((r, i) => (
          <text
            key={r}
            x={ROW.x + 14}
            y={ROW.y + 22 + i * 18}
            fontFamily="var(--mono)"
            fontSize="11"
            fill="var(--cool)"
            letterSpacing="0.02em"
          >
            {r}
          </text>
        ))}
        <line
          x1={ROW.x + ROW.w}
          y1={B.cy}
          x2={B.cx - AGENT_R - 4}
          y2={B.cy}
          stroke="var(--cool)"
          strokeWidth="1.2"
          strokeDasharray="3 4"
        />
      </motion.g>
    </svg>
  );
}

export const schemasSlide: Slide = {
  id: 'schemas',
  title: 'схемы — типы графа',
  totalSteps: 3,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.2fr"
      left={
        <Stack gap={20}>
          <Eyebrow>инженерия графов · 22</Eyebrow>
          <SlideTitle size="md">Схемы — типы графа</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>Между стохастическими узлами нужны жёсткие контракты.</BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>Свободный текст между агентами — это untyped API.</BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>
                <span style={{ color: 'var(--ink)' }}>
                  Схема валидируется на границе: не распарсилось — агент переделывает, а не граф
                  падает.
                </span>
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <SchemaDiagram step={step} />
        </div>
      }
    />
  ),
};
