import { A as AppLayout, m as menuRoutes } from './menuRoutes-CECZZ7AQ.js';

const { reactive, readonly, inject } = Vue;

const StoreSymbol = Symbol('AppStore');

const state = reactive({
  token: 'fake-token-demo-123',
});

function installStore(app) {
  app.provide(StoreSymbol, readonly(state));
}

function useStore() {
  const store = inject(StoreSymbol);
  if (!store) {
    throw new Error('AppStore is not provided');
  }
  return store;
}

const { createApp, computed } = Vue;

const app = createApp({
  components: { AppLayout },
  setup() {
    const store = useStore();
    return {
      menuMap: menuRoutes,
      token: computed(() => store.token),
    };
  },
});

installStore(app);

app.mount('#app');
//# sourceMappingURL=about.js.map
