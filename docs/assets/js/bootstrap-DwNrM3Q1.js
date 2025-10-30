var NavBar = {
  name: 'NavBar',
  props: {
    // Existing array input still works
    items: {
      type: Array,
      default: () => [],
    },
    // New: accept a Map or plain object
    itemsMap: {
      type: [Object],
      default: null,
    },
  },
  computed: {
    normalizedItems() {
      if (Array.isArray(this.items) && this.items.length) return this.items;
      const m = this.itemsMap;
      if (m && typeof m === 'object') {
        const arr = [];
        if (m instanceof Map) {
          for (const [key, val] of m) {
            if (typeof val === 'string') arr.push({ key, label: key, href: val });
            else arr.push({ key, label: val.label ?? key, href: val.href, target: val.target });
          }
        } else {
          for (const [key, val] of Object.entries(m)) {
            if (typeof val === 'string') arr.push({ key, label: key, href: val });
            else arr.push({ key, label: val.label ?? key, href: val.href, target: val.target });
          }
        }
        return arr;
      }
      return [];
    },
  },
  template: /* html */ `
    <nav class="navbar">
      <div class="navbar__inner">
        <div class="navbar__brand">takoBox</div>
        <ul class="navbar__menu">
          <li v-for="(item, i) in normalizedItems" :key="item.key || i">
            <a :href="item.href" :target="item.target || null">{{ item.label }}</a>
          </li>
        </ul>
      </div>
    </nav>
  `,
};

var AppLayout = {
  name: 'AppLayout',
  components: { NavBar },
  props: {
    menuMap: { type: Object, default: null },
    title: { type: String, default: '' },
  },
  template: /* html */ `
    <div class="layout">
      <nav-bar :items-map="menuMap"></nav-bar>
      <main class="container">
        <slot></slot>
      </main>
    </div>
  `,
};

const { inject } = Vue;

const ContainerSymbol = Symbol('AppContainer');

class AppContainer {
  #registry = new Map();

  register(name, service) {
    if (!name) throw new Error('Container.register 需要 name');
    if (!service) throw new Error(`Container.register(${name}) 缺少 service`);
    if (!this.#registry.has(name)) {
      this.#registry.set(name, service);
    }
    return this.#registry.get(name);
  }

  resolve(name) {
    if (!this.#registry.has(name)) {
      throw new Error(`容器中沒有 "${name}"，請先註冊`);
    }
    return this.#registry.get(name);
  }

  has(name) {
    return this.#registry.has(name);
  }

  unregister(name) {
    this.#registry.delete(name);
  }
}

const container = new AppContainer();

function installContainer(app) {
  app.provide(ContainerSymbol, container);
}

function useContainer() {
  return inject(ContainerSymbol, container);
}

function useStore(name) {
  const c = useContainer();
  return c.resolve(name);
}

const { ref, reactive, toRaw } = Vue;

function isPlainObject(val) {
  return Object.prototype.toString.call(val) === '[object Object]';
}

function isTypeMatch(value, template) {
  if (Array.isArray(template)) return Array.isArray(value);
  if (isPlainObject(template)) return isPlainObject(value);
  return typeof value === typeof template;
}

function hasStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function createStore({ name, storageKey = null, defaultValue }) {
  if (!name) throw new Error('createStore 需要 name');
  if (defaultValue === undefined) throw new Error(`createStore(${name}) 缺少 defaultValue`);

  const isObject = isPlainObject(defaultValue);
  const isArray = Array.isArray(defaultValue);

  const state = isObject || isArray ? reactive(structuredClone(defaultValue)) : ref(defaultValue);

  function persist(value) {
    if (!storageKey || !hasStorage()) return;
    try {
      const payload = isObject || isArray ? toRaw(value) : value;
      window.localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch (err) {
      console.warn(`[${name}] 儲存失敗:`, err);
    }
  }

  const store = {
    get() {
      return isObject || isArray ? state : state.value;
    },
    set(value) {
      if (!isTypeMatch(value, defaultValue)) {
        throw new TypeError(`[${name}] set 資料型態錯誤。預期 ${typeof defaultValue}，收到 ${typeof value}`);
      }

      if (isObject) {
        Object.assign(state, value);
      } else if (isArray) {
        state.splice(0, state.length, ...value);
      } else {
        state.value = value;
      }
      persist(store.get());
    },
    patch(partial) {
      if (!(isObject || isArray)) {
        throw new Error(`[${name}] 只有物件或陣列狀態可以使用 patch`);
      }
      if (isObject) {
        Object.assign(state, partial);
      } else {
        throw new Error(`[${name}] 陣列狀態請直接使用 set`);
      }
      persist(store.get());
    },
    clear() {
      if (isObject || isArray) {
        store.set(structuredClone(defaultValue));
      } else {
        state.value = defaultValue;
        persist(defaultValue);
      }
      if (storageKey && hasStorage()) {
        window.localStorage.removeItem(storageKey);
      }
    },
    loadFromStorage() {
      if (!storageKey || !hasStorage()) return;
      try {
        const raw = window.localStorage.getItem(storageKey);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (!isTypeMatch(parsed, defaultValue)) return;
        store.set(parsed);
      } catch (err) {
        console.warn(`[${name}] 載入失敗:`, err);
      }
    },
  };

  store.loadFromStorage();
  store.__storeName = name;
  return store;
}

// Centralized menu routes definition
// Use Map to preserve order and stable keys
const menuRoutes = new Map([
  ['home',   { label: '首頁', href: 'index.html' }],
  ['about',  { label: '關於', href: 'about.html' }],
  ['github', { label: 'GitHub', href: 'https://github.com', target: '_blank' }],
]);

const fallbackItems = (() => {
  if (menuRoutes instanceof Map) {
    return Array.from(menuRoutes.entries()).map(([key, value]) => ({ key, ...value }));
  }
  if (Array.isArray(menuRoutes)) return menuRoutes;
  if (menuRoutes && typeof menuRoutes === 'object') {
    return Object.entries(menuRoutes).map(([key, value]) => ({ key, ...value }));
  }
  return [];
})();

const menuStore = createStore({
  name: 'menuStore',
  storageKey: 'app_menu_data',
  defaultValue: fallbackItems,
});

menuStore.setMenu = (items = []) => {
  if (!Array.isArray(items)) return false;
  menuStore.set(items.map((item, index) => ({
    key: item.key ?? item.label ?? `item-${index}`,
    label: item.label ?? item.key ?? `項目-${index}`,
    href: item.href ?? '#',
    target: item.target ?? null,
  })));
  return true;
};

menuStore.reset = () => {
  menuStore.clear();
};

menuStore.getMap = () => new Map(menuStore.get().map((item) => [item.key, item]));
menuStore.getLabels = () => menuStore.get().map((item) => item.label ?? item.key);

const menuStatusStore = createStore({
  name: 'menuStatusStore',
  storageKey: 'app_menu_status',
  defaultValue: {
    loading: false,
    error: null,
    loaded: false,
    updatedAt: null,
  },
});

menuStatusStore.setLoading = (value) => {
  menuStatusStore.patch({ loading: Boolean(value) });
};

menuStatusStore.setError = (message) => {
  menuStatusStore.patch({
    error: message ?? null,
    loading: false,
    loaded: true,
    updatedAt: Date.now(),
  });
};

menuStatusStore.setSuccess = () => {
  menuStatusStore.patch({
    loading: false,
    error: null,
    loaded: true,
    updatedAt: Date.now(),
  });
};

menuStatusStore.reset = () => {
  menuStatusStore.clear();
};

const tokenStore = createStore({
  name: 'tokenStore',
  storageKey: 'app_token',
  defaultValue: 'fake-token-demo-123',
});

tokenStore.setToken = (token) => {
  tokenStore.set(token ?? '');
};

tokenStore.clearToken = () => {
  tokenStore.set('');
};

container.register('menuStore', menuStore);
container.register('menuStatusStore', menuStatusStore);
container.register('tokenStore', tokenStore);

let mockEnabled = true;

function isMockEnabled() {
  if (typeof window !== 'undefined' && '__API_USE_MOCK__' in window) {
    return Boolean(window.__API_USE_MOCK__);
  }
  return mockEnabled;
}

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

function registerMock(method, url, resolver) {
  for (const key of createKeys(method, url)) {
    mockHandlers.set(key, resolver);
  }
}

async function tryMockResponse(options) {
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

function withDelay(data, ms = defaultDelay) {
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

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

const baseUrl = '';

async function request({ url, method = 'GET', body, headers = {}, withAuth = true }) {
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

function fetchMenu() {
  return request({
    url: '/api/menu',
  });
}

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

function ensureMenuInitialized() {
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

function loadMenu({ force = false } = {}) {
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

function createAppShell(Vue, { setup = () => ({}) } = {}) {
  const { createApp, computed } = Vue;
  const app = createApp({
    components: { AppLayout },
    setup(props, ctx) {
      const menuStore = useStore('menuStore');
      const menuStatus = useStore('menuStatusStore');
      const menuItems = computed(() => menuStore.get());
      const menuMap = computed(() => new Map(menuItems.value.map((item) => [item.key, item])));
      const base = {
        menuMap,
        menuLoading: computed(() => menuStatus.get().loading),
        menuError: computed(() => menuStatus.get().error),
        menuItems,
      };
      const baseWithLabels = {
        ...base,
        menuLabels: computed(() =>
          menuItems.value.map((item) => item.label ?? item.key).join(', ')
        ),
      };

      const extra = setup
        ? setup({ props, ctx, stores: { menu: menuStore, menuStatus } })
        : null;
      return {
        ...baseWithLabels,
        ...(extra && typeof extra === 'object' ? extra : {}),
      };
    },
  });

  installContainer(app);
  ensureMenuInitialized();
  loadMenu();

  return app;
}

export { createAppShell as c, useStore as u };
//# sourceMappingURL=bootstrap-DwNrM3Q1.js.map
