const { reactive, readonly, inject } = Vue;

const StoreSymbol = Symbol('AppStore');

const state = reactive({
  token: 'fake-token-demo-123',
});

export function installStore(app) {
  app.provide(StoreSymbol, readonly(state));
}

export function useStore() {
  const store = inject(StoreSymbol);
  if (!store) {
    throw new Error('AppStore is not provided');
  }
  return store;
}
