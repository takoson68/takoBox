import AppLayout from '@/views/layout/Layout.js';
import { installContainer, useStore } from '@/stores/container.js';
import '@/stores/index.js';
import { ensureMenuInitialized, loadMenu } from '@/services/menuService.js';

export function createAppShell(Vue, { setup = () => ({}) } = {}) {
  const { createApp, computed } = Vue;
  const app = createApp({
    components: { AppLayout },
    setup(props, ctx) {
      const menuStore = useStore('menuStore');
      const menuStatus = useStore('menuStatusStore');
      const menuItems = computed(() => menuStore.get());
      const menuMap = computed(() => new Map(menuItems.value.map((item) => [item.key, item])));
      const base = {
        menuMap,
        menuLoading: computed(() => menuStatus.get().loading),
        menuError: computed(() => menuStatus.get().error),
        menuItems,
      };
      const baseWithLabels = {
        ...base,
        menuLabels: computed(() =>
          menuItems.value.map((item) => item.label ?? item.key).join(', ')
        ),
      };

      const extra = setup
        ? setup({ props, ctx, stores: { menu: menuStore, menuStatus } })
        : null;
      return {
        ...baseWithLabels,
        ...(extra && typeof extra === 'object' ? extra : {}),
      };
    },
  });

  installContainer(app);
  ensureMenuInitialized();
  loadMenu();

  return app;
}
