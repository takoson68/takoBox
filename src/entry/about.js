const { createApp, computed } = Vue;
import AppLayout from 'views/layout/Layout.js';
import menuMap from 'controllers/menuRoutes.js';
import { installStore, useStore } from 'stores/container.js';

const app = createApp({
  components: { AppLayout },
  setup() {
    const store = useStore();
    return {
      menuMap,
      token: computed(() => store.token),
    };
  },
});

installStore(app);

app.mount('#app');
