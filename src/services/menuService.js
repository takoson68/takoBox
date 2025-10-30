import menuRoutes from '@/controllers/menuRoutes.js';
import menuStore from '@/stores/menuStore.js';
import menuStatusStore from '@/stores/menuStatusStore.js';
import { fetchMenu } from 'api/index.js';

let pendingPromise = null;

function normalizeMenu(items) {
  if (!items) return [];
  const source = Array.isArray(items) ? items : items instanceof Map ? Array.from(items.values()) : Object.values(items);
  return source
    .filter(Boolean)
    .map((item, index) => ({
      key: item.key ?? item.label ?? `item-${index}`,
      label: item.label ?? item.key ?? `項目-${index}`,
      href: item.href ?? '#',
      target: item.target ?? null,
    }));
}

function fallbackMenu() {
  if (menuRoutes instanceof Map) {
    return Array.from(menuRoutes.entries()).map(([key, value]) => ({ key, ...value }));
  }
  if (Array.isArray(menuRoutes)) return menuRoutes;
  if (menuRoutes && typeof menuRoutes === 'object') {
    return Object.entries(menuRoutes).map(([key, value]) => ({ key, ...value }));
  }
  return [];
}

export function ensureMenuInitialized() {
  if (!menuStore.get().length) {
    const fallback = normalizeMenu(fallbackMenu());
    if (fallback.length) menuStore.set(fallback);
  }
}

async function fetchAndApplyMenu() {
  menuStatusStore.setLoading(true);
  try {
    const data = await fetchMenu();
    const normalized = normalizeMenu(data?.items);
    if (normalized.length) {
      menuStore.set(normalized);
      menuStatusStore.setSuccess();
    } else {
      const fallback = normalizeMenu(fallbackMenu());
      if (fallback.length) menuStore.set(fallback);
      menuStatusStore.setError('菜單資料格式不正確');
    }
  } catch (err) {
    const fallback = normalizeMenu(fallbackMenu());
    if (fallback.length) menuStore.set(fallback);
    menuStatusStore.setError(err?.message || String(err));
  }
}

export function loadMenu({ force = false } = {}) {
  ensureMenuInitialized();
  const status = menuStatusStore.get();
  if (!force && status.loaded && !status.error) return Promise.resolve();
  if (!pendingPromise || force) {
    pendingPromise = fetchAndApplyMenu().finally(() => {
      pendingPromise = null;
    });
  }
  return pendingPromise;
}

export function clearMenuCache() {
  menuStore.clear();
  menuStatusStore.clear();
}
