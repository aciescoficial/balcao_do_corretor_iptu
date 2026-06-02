
import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll, vi } from 'vitest';

beforeAll(() => {
  // Setup global test environment
  vi.mock('@/integrations/supabase/client', () => ({
    supabase: {
      from: vi.fn(),
    },
  }));
});

afterEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  vi.resetAllMocks();
});
