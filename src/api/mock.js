const mockHandlers = new Map();

const defaultDelay = 150;

function createKeys(method, url) {
  const upper = method.toUpperCase();
  const keys = [`${upper} ${url}`];
  if (/^https?:\/\//i.test(url)) {
    try {
      const parsed = new URL(url);
      keys.push(`${upper} ${parsed.pathname}`);
    } catch (err) {
      console.warn('[mock] Failed to parse URL for mock key', url, err);
    }
  }
  return keys;
}

export function registerMock(method, url, resolver) {
  for (const key of createKeys(method, url)) {
    mockHandlers.set(key, resolver);
  }
}

export async function tryMockResponse(options) {
  const { method = 'GET', url } = options;
  const keys = createKeys(method, url);
  for (const key of keys) {
    if (mockHandlers.has(key)) {
      const handler = mockHandlers.get(key);
      return handler(options);
    }
  }
  return null;
}

export function withDelay(data, ms = defaultDelay) {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

registerMock('GET', '/api/menu', async () => {
  return withDelay({
    items: [
      { key: 'home', label: '首頁 (Mock)', href: 'index.html' },
      { key: 'about', label: '關於 (Mock)', href: 'about.html' },
      { key: 'docs', label: 'Docs', href: 'https://example.com/docs', target: '_blank' },
    ],
  });
});

registerMock('GET', 'https://jsonplaceholder.typicode.com/users/1', async () => {
  return withDelay({
    id: 1,
    name: 'Mock User',
    email: 'mock@example.com',
    phone: '123-456-7890',
  });
});
