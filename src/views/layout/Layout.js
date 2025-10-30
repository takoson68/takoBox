import NavBar from '../components/NavBar.js';

export default {
  name: 'AppLayout',
  components: { NavBar },
  props: {
    menuMap: { type: Object, default: null },
    title: { type: String, default: '' },
  },
  mounted() {
    // Lazy-load layout stylesheet once per page
    const id = 'css-Layout';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = new URL('./Layout.css', import.meta.url).href;
      document.head.appendChild(link);
    }
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
