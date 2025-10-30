import { createAppShell } from '@/app/bootstrap.js';

const { ref } = Vue;

const app = createAppShell(Vue, {
  setup() {
    const count = ref(0);
    return { count };
  },
});

app.mount('#app');
