import { createStore } from './_storeFactory.js';
import menuRoutes from '@/controllers/menuRoutes.js';

const fallbackItems = (() => {
  if (menuRoutes instanceof Map) {
    return Array.from(menuRoutes.entries()).map(([key, value]) => ({ key, ...value }));
  }
  if (Array.isArray(menuRoutes)) return menuRoutes;
  if (menuRoutes && typeof menuRoutes === 'object') {
    return Object.entries(menuRoutes).map(([key, value]) => ({ key, ...value }));
  }
  return [];
})();

const menuStore = createStore({
  name: 'menuStore',
  storageKey: 'app_menu_data',
  defaultValue: fallbackItems,
});

menuStore.setMenu = (items = []) => {
  if (!Array.isArray(items)) return false;
  menuStore.set(items.map((item, index) => ({
    key: item.key ?? item.label ?? `item-${index}`,
    label: item.label ?? item.key ?? `項目-${index}`,
    href: item.href ?? '#',
    target: item.target ?? null,
  })));
  return true;
};

menuStore.reset = () => {
  menuStore.clear();
};

menuStore.getMap = () => new Map(menuStore.get().map((item) => [item.key, item]));
menuStore.getLabels = () => menuStore.get().map((item) => item.label ?? item.key);

export default menuStore;
