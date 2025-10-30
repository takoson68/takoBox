let mockEnabled = true;

export function isMockEnabled() {
  if (typeof window !== 'undefined' && '__API_USE_MOCK__' in window) {
    return Boolean(window.__API_USE_MOCK__);
  }
  return mockEnabled;
}

export function setMockEnabled(enabled) {
  mockEnabled = Boolean(enabled);
}
