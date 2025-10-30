import { createStore } from './_storeFactory.js';

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

export default tokenStore;
