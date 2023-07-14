import { test, expect } from 'vitest';

import lib from '../';

test('ok', () => {
  expect(lib()).toMatch('something');
});
