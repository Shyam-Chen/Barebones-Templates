import { request } from '@x/ui';
import { addHours, formatISO } from 'date-fns';
import { reactive, readonly } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { defineStore } from 'vue-storer';

import type { Message } from './types.ts';

export default defineStore('/(chat)', () => {
  const router = useRouter();
  const route = useRoute();

  const state = reactive({
    messages: [] as Message[],
  });

  const getters = readonly({});

  const actions = readonly({
    async signIn() {
      state.signInLoading = true;

      const response = await request<SignInRes>('/auth/sign-in', {
        method: 'POST',
        body: state.signInForm,
      });

      const result = response._data;

      if (response.status === 200) {
        if (result?.accessToken && !result?.otpEnabled && !result?.otpVerified) {
          localStorage.setItem('accessToken', result.accessToken);
          localStorage.setItem('refreshToken', result.refreshToken);
          localStorage.setItem('expiresIn', formatISO(addHours(new Date(), 12)));
          const path = route.redirectedFrom?.path || '/dashboard';
          await router.push(path === '/' ? '/dashboard' : path);
        }

        if (!result?.accessToken && result?.otpEnabled && result?.otpVerified) {
          state.otpEnabled = true;
        }

        if (result?.accessToken && result?.otpEnabled && !result?.otpVerified) {
          localStorage.setItem('accessToken', result.accessToken);
          localStorage.setItem('refreshToken', result.refreshToken);
          localStorage.setItem('expiresIn', formatISO(addHours(new Date(), 12)));
          await router.push('/two-factor-auth');
        }
      }

      if (response.status === 400) {
        const found = result?.message?.match(/(#+[a-zA-Z0-9(_)]{1,})/gm)?.[0];

        if (found) {
          const errKey = found.replace('#', '') as keyof SignInForm;
          state.signInValdn[errKey] = result?.message.replace(`${found} `, '');
        }

        state.signInLoading = false;
      }
    },
    async inputCode() {
      if (state.mfaAuthCode.length === 6) {
        const response = await request<OtpValidateRes>('/auth/otp/validate', {
          method: 'POST',
          body: {
            code: state.mfaAuthCode,
            username: state.signInForm.username,
            password: state.signInForm.password,
          },
        });

        const result = response._data;

        if (response.status === 200) {
          if (result?.accessToken && result?.refreshToken) {
            localStorage.setItem('accessToken', result.accessToken);
            localStorage.setItem('refreshToken', result.refreshToken);
            localStorage.setItem('expiresIn', formatISO(addHours(new Date(), 12)));
            const path = route.redirectedFrom?.path || '/dashboard';
            await router.push(path === '/' ? '/dashboard' : path);
          }
        }
      }
    },
  });

  return { state, getters, actions };
});
