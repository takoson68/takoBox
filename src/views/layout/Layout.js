import NavBar from '../components/NavBar.js';

export default {
  name: 'AppLayout',
  components: { NavBar },
  props: {
    menuMap: { type: Object, default: null },
    title: { type: String, default: '' },
  },
  template: /* html */ `
    <div class="layout">
      <nav-bar :items-map="menuMap"></nav-bar>
      <main class="container">
        <slot></slot>
      </main>
    </div>
  `,
};
