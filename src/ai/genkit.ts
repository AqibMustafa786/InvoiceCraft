
'use server';

import { genkit, Ai } from '@genkit-ai/ai';
import { googleAI } from '@genkit-ai/googleai';
import { next } from '@genkit-ai/next';

export const ai: Ai = genkit({
  plugins: [
    googleAI({
      apiVersion: 'v1beta',
    }),
    next(),
  ],
  logSinks: [next()],
  enableTracing: true,
});
