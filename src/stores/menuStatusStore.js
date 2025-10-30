import { createStore } from './_storeFactory.js';

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

export default menuStatusStore;
