import type { Slide } from '../deck/types';
import { titleSlide } from './01-title';
import { neuronSlide } from './02-neuron';
import { networkSlide } from './03-network';
import { transformerBlockSlide } from './04-transformer-block';
import { llmShapeSlide } from './05-llm-shape';
import { textVsTokensSlide } from './06-text-vs-tokens';
import { tokenizerSlide } from './07-tokenizer';
import { attentionIntuitionSlide } from './08-attention-intuition';
import { attentionDeepSlide } from './09-attention-deep';
import { nextTokenSlide } from './10-next-token';
import { chatSlide } from './11-chat';
import { toolsSlide } from './12-tools';
import { agentLoopSlide } from './13-agent-loop';
import { harnessSlide } from './14-harness';
import { compactionSlide } from './15-compaction';
import { noLearningSlide } from './16-no-learning';
import { memorySlide } from './17-memory';
import { memoryApproachesSlide } from './18-memory-approaches';
import { systemPromptsSlide } from './19-system-prompts';
import { skillsSlide } from './20-skills';
import { denseVsMoeSlide } from './21-dense-vs-moe';
import { modelZooSlide } from './22-model-zoo';
import { recapSlide } from './23-recap';

export const slides: Slide[] = [
  titleSlide,
  neuronSlide,
  networkSlide,
  transformerBlockSlide,
  llmShapeSlide,
  textVsTokensSlide,
  tokenizerSlide,
  attentionIntuitionSlide,
  attentionDeepSlide,
  nextTokenSlide,
  chatSlide,
  toolsSlide,
  agentLoopSlide,
  harnessSlide,
  compactionSlide,
  noLearningSlide,
  memorySlide,
  memoryApproachesSlide,
  systemPromptsSlide,
  skillsSlide,
  denseVsMoeSlide,
  modelZooSlide,
  recapSlide,
];
