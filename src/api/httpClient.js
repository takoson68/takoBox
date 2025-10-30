import container from '@/stores/container.js';
import '@/stores/index.js';
import { isMockEnabled } from './config.js';
import { tryMockResponse } from './mock.js';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

const baseUrl = '';

export async function request({ url, method = 'GET', body, headers = {}, withAuth = true }) {
  let token = null;
  if (withAuth && container.has('tokenStore')) {
    try {
      const tokenStore = container.resolve('tokenStore');
      token = tokenStore.get?.() ?? null;
    } catch (err) {
      console.warn('[httpClient] 讀取 token 失敗:', err?.message || err);
    }
  }

  const init = {
    method,
    headers: {
      ...DEFAULT_HEADERS,
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  if (body && method !== 'GET') {
    init.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  const resolvedUrl = resolveUrl(url);

  if (isMockEnabled()) {
    const mockResult = await tryMockResponse({ method, url: resolvedUrl, body });
    if (mockResult !== null && mockResult !== undefined) {
      return mockResult;
    }
  }
  const response = await fetch(resolvedUrl, init);
  if (!response.ok) {
    const errorText = await safeReadText(response);
    throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
  }

  return await parseJson(response);
}

function resolveUrl(url) {
  if (/^https?:\/\//i.test(url)) return url;
  return `${baseUrl}${url}`;
}

async function parseJson(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (err) {
    console.warn('[httpClient] Failed to parse JSON response', err);
    return null;
  }
}

async function safeReadText(response) {
  try {
    return await response.text();
  } catch (err) {
    console.warn('Failed to read error response body', err);
    return '';
  }
}
