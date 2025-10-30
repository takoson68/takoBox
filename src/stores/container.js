const { inject } = Vue;

const ContainerSymbol = Symbol('AppContainer');

class AppContainer {
  #registry = new Map();

  register(name, service) {
    if (!name) throw new Error('Container.register 需要 name');
    if (!service) throw new Error(`Container.register(${name}) 缺少 service`);
    if (!this.#registry.has(name)) {
      this.#registry.set(name, service);
    }
    return this.#registry.get(name);
  }

  resolve(name) {
    if (!this.#registry.has(name)) {
      throw new Error(`容器中沒有 "${name}"，請先註冊`);
    }
    return this.#registry.get(name);
  }

  has(name) {
    return this.#registry.has(name);
  }

  unregister(name) {
    this.#registry.delete(name);
  }
}

const container = new AppContainer();

export function installContainer(app) {
  app.provide(ContainerSymbol, container);
}

export function useContainer() {
  return inject(ContainerSymbol, container);
}

export function useStore(name) {
  const c = useContainer();
  return c.resolve(name);
}

export function resolveStore(name) {
  return container.resolve(name);
}

export default container;
