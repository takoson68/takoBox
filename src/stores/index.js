import container from './container.js';
import menuStore from './menuStore.js';
import menuStatusStore from './menuStatusStore.js';
import tokenStore from './tokenStore.js';

container.register('menuStore', menuStore);
container.register('menuStatusStore', menuStatusStore);
container.register('tokenStore', tokenStore);

export { container, menuStore, menuStatusStore, tokenStore };
