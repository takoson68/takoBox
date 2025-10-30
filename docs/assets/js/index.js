import { A as AppLayout, m as menuRoutes } from './menuRoutes-CVCOp5YY.js';

const { createApp, ref } = Vue;

createApp({
  components: { AppLayout },
  setup() {
    const count = ref(0);
    return { count, menuMap: menuRoutes };
  },
}).mount('#app');
//# sourceMappingURL=index.js.map
