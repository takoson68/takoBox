const { createApp } = Vue;
import AppLayout from 'views/layout/Layout.js';
import menuMap from 'controllers/menuRoutes.js';

createApp({
  components: { AppLayout },
  setup() {
    return { menuMap };
  },
}).mount('#app');
