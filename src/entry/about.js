import { createAppShell } from '@/app/bootstrap.js';
import { useStore } from '@/stores/container.js';

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
