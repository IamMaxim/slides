import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * The deck's spine: six eras of the coding loop, in order.
 * The loop glyph rides above this strip and migrates era to era.
 */
const ERAS = ['чатбот', 'автокомплит', 'агент в IDE', 'harness', 'slash-команды', 'графы агентов'];

/**
 * Where the glyph was last parked, remembered across slides. Slides unmount on
 * transition (Deck uses AnimatePresence mode="wait"), so without this the glyph
 * would pop into place; with it, a freshly mounted timeline animates the glyph
 * in from the previous slide's era. Purely decorative — never read for layout.
 */
let lastCurrent = 0;

/**
 * Fixed width of the compact strip's label slot, sized to the longest label
 * («SLASH-КОМАНДЫ» / «ГРАФЫ АГЕНТОВ» ≈ 97px at 11px mono + 0.08em tracking).
 * Constant geometry means a corner-anchored marker never jitters as the era
 * changes, and the slot still occupies its space when no era is current.
 */
const COMPACT_LABEL_WIDTH = 100;

function LoopGlyph({ size, color }: { size: number; color: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden>
      {/* two arcs + arrowheads: the feedback loop, turning */}
      <path
        d="M5.03 11.39 A7 7 0 0 1 17.73 7.98"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
      <path
        d="M18.97 12.61 A7 7 0 0 1 6.27 16.02"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
      <path d="M19.45 10.44 L15.51 8.81 L19.27 6.17 Z" fill={color} />
      <path d="M4.55 13.56 L8.49 15.19 L4.73 17.83 Z" fill={color} />
    </svg>
  );
}

type Props = {
  /** 0–5: the era the loop currently lives in. Undefined = no era highlighted, glyph hidden. */
  current?: number;
  /** How many eras are revealed; the rest stay at opacity 0.15 but keep their layout slot. */
  revealed?: number;
  /** Small strip for use as a corner / footer progress marker on era slides. */
  compact?: boolean;
};

export function EraTimeline({ current, revealed = 6, compact = false }: Props) {
  // Glyph entry position: where it sat on the previous slide.
  const [from] = useState(() => lastCurrent);
  useEffect(() => {
    if (current !== undefined) lastCurrent = current;
  }, [current]);

  const dot = compact ? 6 : 8;
  const glyphSize = compact ? 13 : 20;
  const glyphRow = compact ? 16 : 26;
  const cell = compact ? 'clamp(18px, 2.2vw, 26px)' : `${100 / ERAS.length}%`;

  const strip = (
    <div
      style={{
        position: 'relative',
        width: compact ? `calc(${cell} * ${ERAS.length})` : '100%',
      }}
    >
      {/* loop glyph: rides one cell per era, spins forever (ambient, step-independent) */}
      <div style={{ position: 'relative', height: glyphRow }}>
        <motion.div
          initial={{ x: `${from * 100}%`, opacity: current === undefined ? 0 : 1 }}
          animate={{
            x: `${(current ?? from) * 100}%`,
            opacity: current === undefined ? 0 : 1,
          }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: compact ? cell : `calc(100% / ${ERAS.length})`,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 16, ease: 'linear', repeat: Infinity }}
            style={{ display: 'flex', lineHeight: 0 }}
          >
            <LoopGlyph size={glyphSize} color="var(--accent)" />
          </motion.div>
        </motion.div>
      </div>

      {/* connecting rail: first dot centre → last dot centre */}
      <div
        style={{
          position: 'absolute',
          left: `calc(${cell} / 2)`,
          right: `calc(${cell} / 2)`,
          top: glyphRow + dot / 2,
          height: 1,
          background: 'var(--line)',
        }}
      />

      {/* dots + labels */}
      <div
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: compact
            ? `repeat(${ERAS.length}, ${cell})`
            : `repeat(${ERAS.length}, 1fr)`,
        }}
      >
        {ERAS.map((era, i) => {
          const active = i === current;
          return (
            <div
              key={era}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                opacity: i >= revealed ? 0.15 : 1,
                transition: 'opacity 450ms ease',
              }}
            >
              <span
                style={{
                  width: dot,
                  height: dot,
                  borderRadius: '50%',
                  background: active ? 'var(--accent)' : 'var(--ink-mute)',
                  boxShadow: active ? '0 0 0 4px var(--accent-soft)' : '0 0 0 0 transparent',
                  transition: 'background 350ms ease, box-shadow 350ms ease',
                }}
              />
              {!compact && (
                <span
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 11,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    color: active ? 'var(--accent)' : 'var(--ink-mute)',
                    transition: 'color 350ms ease',
                  }}
                >
                  {era}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  if (!compact) return strip;

  // Compact: the strip stays narrow enough for a corner marker, so only the
  // current era is spelled out — at full 11px so it stays readable from the back.
  // The label slot is a fixed width (sized to the longest label) and is always
  // rendered, so the component's total width — and therefore the dots' position
  // under any anchoring — is identical for every value of `current`.
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {strip}
      <span
        style={{
          flex: `0 0 ${COMPACT_LABEL_WIDTH}px`,
          width: COMPACT_LABEL_WIDTH,
          fontFamily: 'var(--mono)',
          fontSize: 11,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          color: 'var(--accent)',
          transition: 'color 350ms ease',
          marginTop: glyphRow / 2,
        }}
      >
        {current === undefined ? '' : ERAS[current]}
      </span>
    </div>
  );
}
