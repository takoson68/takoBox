const { createApp, ref } = Vue;
import AppLayout from 'views/layout/Layout.js';
import menuMap from 'controllers/menuRoutes.js';

createApp({
  components: { AppLayout },
  setup() {
    const count = ref(0);
    return { count, menuMap };
  },
}).mount('#app');
