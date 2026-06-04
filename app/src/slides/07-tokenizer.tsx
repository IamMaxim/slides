import { useMemo, useState } from 'react';
import { encode, decode } from 'gpt-tokenizer';
import type { Slide } from '../deck/types';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Stack } from '../ui/Layout';

const DEFAULT_TEXT = `The harness doesn't reason — it just runs the loop.

It assembles the prompt, calls the model, parses any tool_use blocks, executes them, and feeds the results back in. Repeat until done.`;

const PALETTE = [
  'rgba(255, 181, 71, 0.18)',
  'rgba(123, 214, 195, 0.18)',
  'rgba(174, 167, 152, 0.14)',
  'rgba(255, 122, 122, 0.16)',
];

function visibleWS(s: string) {
  return s.replace(/ /g, '·').replace(/\n/g, '↵\n');
}

export const tokenizerSlide: Slide = {
  id: 'tokenizer',
  title: 'try a tokenizer',
  totalSteps: 1,
  render: () => <TokenizerSlide />,
};

function TokenizerSlide() {
  const [text, setText] = useState(DEFAULT_TEXT);

  const tokens = useMemo(() => {
    try {
      const ids = encode(text);
      return ids.map((id) => ({ id, text: decode([id]) }));
    } catch {
      return [];
    }
  }, [text]);

  return (
    <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', height: '100%', gap: 24 }}>
      <Stack gap={12}>
        <Eyebrow>interactive · 06</Eyebrow>
        <SlideTitle size="md">Try it: type something. Watch how the chunks fall.</SlideTitle>
        <BodyText size="sm">
          Real BPE tokenizer (o200k_base — used by GPT-4o). Click into the textarea; keyboard nav is paused while you type.
        </BodyText>
      </Stack>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 28, minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 10,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--ink-mute)',
              }}
            >
              text input
            </span>
            <span
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 11,
                color: 'var(--ink-soft)',
              }}
            >
              {text.length} chars
            </span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{
              flex: 1,
              padding: 16,
              background: 'var(--bg-elev)',
              border: '1px solid var(--line)',
              borderRadius: 6,
              color: 'var(--ink)',
              fontFamily: 'var(--mono)',
              fontSize: 14,
              lineHeight: 1.5,
              resize: 'none',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-line)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--line)';
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 10,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--accent)',
              }}
            >
              tokens
            </span>
            <span
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 11,
                color: 'var(--ink-soft)',
              }}
            >
              {tokens.length} tokens · ratio {tokens.length ? (text.length / tokens.length).toFixed(2) : '—'} chars/token
            </span>
          </div>
          <div
            style={{
              flex: 1,
              padding: 14,
              background: 'var(--bg-elev)',
              border: '1px solid var(--line)',
              borderRadius: 6,
              overflow: 'auto',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 4,
              alignContent: 'flex-start',
            }}
          >
            {tokens.map((t, i) => (
              <span
                key={i}
                title={`id ${t.id}`}
                style={{
                  display: 'inline-flex',
                  flexDirection: 'column',
                  padding: '4px 8px',
                  background: PALETTE[i % PALETTE.length],
                  border: '1px solid var(--line)',
                  borderRadius: 4,
                  fontFamily: 'var(--mono)',
                  fontSize: 13,
                  color: 'var(--ink)',
                  whiteSpace: 'pre',
                  lineHeight: 1.2,
                }}
              >
                <span>{visibleWS(t.text)}</span>
                <span style={{ fontSize: 9, color: 'var(--ink-mute)', marginTop: 2 }}>{t.id}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
