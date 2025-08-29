import { render } from 'vitest-browser-vue';

import 'virtual:uno.css';

import router from '~/plugins/router.ts';

import Layout from '../+layout.vue';

test('/+layout.vue', async () => {
  const wrapper = render(Layout, { global: { plugins: [router] } });

  const push = vi.spyOn(router, 'push');
  await router.isReady();

  await wrapper.getByTestId('about').click();
  // expect(push).toHaveBeenCalledTimes(1);
  // expect(push).toHaveBeenCalledWith('/about');

  // await wrapper.get('[data-testid="contact"]').trigger('click');
  // expect(push).toHaveBeenCalledTimes(2);
  // expect(push).toHaveBeenCalledWith('/contact');

  // await wrapper.get('[data-testid="home"]').trigger('click');
  // expect(push).toHaveBeenCalledTimes(3);
  // expect(push).toHaveBeenCalledWith('/');
});
