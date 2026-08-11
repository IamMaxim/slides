import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Stack } from '../ui/Layout';
import { EraTimeline } from '../ui/EraTimeline';

/** Geometry of the claim stage. The glyph starts big and centred, then lands
 *  on era 0 of the timeline — so these constants must agree with EraTimeline's
 *  non-compact metrics (glyph row 26px, glyph 20px, six equal cells). */
const AREA_W = 780;
const AREA_H = 230;
const GLYPH_BOX = 96;
const LANDED_SIZE = 20;
const BIG_CENTER_Y = 64;
/** Centre of EraTimeline's own glyph row, measured from the top of the stage. */
const LANDED_CENTER_Y = 186;
/** The wrapper is one timeline cell wide; 250% of its width puts it dead centre. */
const CENTERED_X = '250%';

function LoopGlyph({ size, color }: { size: number; color: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden>
      <path d="M5.03 11.39 A7 7 0 0 1 17.73 7.98" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
      <path d="M18.97 12.61 A7 7 0 0 1 6.27 16.02" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
      <path d="M19.45 10.44 L15.51 8.81 L19.27 6.17 Z" fill={color} />
      <path d="M4.55 13.56 L8.49 15.19 L4.73 17.83 Z" fill={color} />
    </svg>
  );
}

function ClaimStage({ step }: { step: number }) {
  const landed = step >= 2;
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: AREA_W, height: AREA_H }}>
      {/* the six eras, revealed at step 1 and held dim: a map, not the subject */}
      <Build
        step={step}
        appearAt={1}
        duration={0.55}
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}
      >
        {/* dimmed on an inner node: Build drives opacity itself */}
        <div style={{ opacity: 0.55 }}>
          <EraTimeline revealed={6} />
        </div>
      </Build>

      {/* the loop itself: big and homeless, then parked on era 0 */}
      <motion.div
        initial={false}
        animate={{
          x: landed ? '0%' : CENTERED_X,
          y: (landed ? LANDED_CENTER_Y : BIG_CENTER_Y) - GLYPH_BOX / 2,
          scale: landed ? LANDED_SIZE / GLYPH_BOX : 1,
        }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${100 / 6}%`,
          height: GLYPH_BOX,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* ambient: the loop never stops turning, whatever step we are on */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 16, ease: 'linear', repeat: Infinity }}
          style={{ display: 'flex', lineHeight: 0 }}
        >
          <LoopGlyph size={GLYPH_BOX} color="var(--accent)" />
        </motion.div>
      </motion.div>
    </div>
  );
}

export const claimSlide: Slide = {
  id: 'claim',
  title: 'миграция цикла',
  totalSteps: 3,
  render: ({ step }) => (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Stack gap={0} align="center" style={{ textAlign: 'center' }}>
        <Eyebrow>пролог · 3</Eyebrow>
        <SlideTitle size="md" align="center">
          История — это миграция цикла.
        </SlideTitle>
      </Stack>

      <Stack gap={10} align="center" style={{ marginTop: 26, textAlign: 'center', maxWidth: 720 }}>
        <Build step={step} appearAt={0}>
          <BodyText size="lg">
            Вся история AI-инструментов — это один сюжет: цикл обратной связи переезжает ближе к модели.
          </BodyText>
        </Build>
        <Build step={step} appearAt={1}>
          <BodyText>Шесть эпох — шесть мест, где жил цикл.</BodyText>
        </Build>
        <Build step={step} appearAt={2}>
          <BodyText>
            <span style={{ color: 'var(--ink)' }}>
              Каждая эпоха научила нас одному инженерному принципу. Поехали.
            </span>
          </BodyText>
        </Build>
      </Stack>

      <div style={{ marginTop: 30, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <ClaimStage step={step} />
      </div>
    </div>
  ),
};
