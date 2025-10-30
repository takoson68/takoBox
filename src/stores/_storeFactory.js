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

export function createStore({ name, storageKey = null, defaultValue }) {
  if (!name) throw new Error('createStore 需要 name');
  if (defaultValue === undefined) throw new Error(`createStore(${name}) 缺少 defaultValue`);

  const isObject = isPlainObject(defaultValue);
  const isArray = Array.isArray(defaultValue);
  const isPrimitive = !isObject && !isArray;

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
