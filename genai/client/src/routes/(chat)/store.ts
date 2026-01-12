import { addHours, formatISO } from 'date-fns';
import { reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { defineStore } from 'vue-storer';
import { stream } from 'fetch-event-stream';

import type { Message } from './types.ts';

export default defineStore('/(chat)', () => {
  const router = useRouter();
  const route = useRoute();

  const state = reactive({
    connecting: false,
    prompt: '',
    messages: [] as Message[],
    abortController: null as AbortController | null,
  });

  const getters = reactive({});

  const actions = reactive({
    async sendPrompt() {
      state.connecting = true;

      const userId = self.crypto.randomUUID();
      const prompt = state.prompt.trim();
      state.messages = [...state.messages, { id: userId, role: 'user', content: prompt }];
      state.prompt = '';

      state.abortController = new AbortController();

      const textStream = await stream(`${process.env.API_URL}/api/chat`, {
        method: 'POST',
        body: JSON.stringify({ messages: state.messages }),
        signal: state.abortController.signal,
      });

      const assistantId = self.crypto.randomUUID();
      state.messages.push({ id: assistantId, role: 'assistant', content: '' });
      const assistantMessageIndex = state.messages.findIndex((m) => m.id === assistantId);

      for await (const textPart of textStream) {
        if (textPart.event === 'end') break;

        state.messages[assistantMessageIndex].content += textPart.data;
      }

      state.connecting = false;
    },
  });

  return { state, getters, actions };
});
