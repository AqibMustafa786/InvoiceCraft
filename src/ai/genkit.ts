'use server';

import { genkit, Ai } from '@genkit-ai/ai';
import { googleAI } from '@genkit-ai/google-genai';
import { genkitNext } from '@genkit-ai/next';

export const ai: Ai = genkit({
  plugins: [
    googleAI({
      apiVersion: 'v1beta',
    }),
    genkitNext(),
  ],
  logSinks: [genkitNext()],
  enableTracing: true,
});
