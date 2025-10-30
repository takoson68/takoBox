import { c as createAppShell, u as useStore } from './bootstrap-DwNrM3Q1.js';

const { computed } = Vue;

const app = createAppShell(Vue, {
  setup() {
    const tokenStore = useStore('tokenStore');
    return {
      token: computed(() => tokenStore.get()),
    };
  },
});

app.mount('#app');
//# sourceMappingURL=about.js.map
