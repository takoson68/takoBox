export default {
  name: 'NavBar',
  props: {
    // Existing array input still works
    items: {
      type: Array,
      default: () => [],
    },
    // New: accept a Map or plain object
    itemsMap: {
      type: [Object],
      default: null,
    },
  },
  mounted() {
    // Lazy-load component stylesheet once per page
    const id = 'css-NavBar';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = new URL('./NavBar.css', import.meta.url).href;
      document.head.appendChild(link);
    }
  },
  computed: {
    normalizedItems() {
      if (Array.isArray(this.items) && this.items.length) return this.items;
      const m = this.itemsMap;
      if (m && typeof m === 'object') {
        const arr = [];
        if (m instanceof Map) {
          for (const [key, val] of m) {
            if (typeof val === 'string') arr.push({ key, label: key, href: val });
            else arr.push({ key, label: val.label ?? key, href: val.href, target: val.target });
          }
        } else {
          for (const [key, val] of Object.entries(m)) {
            if (typeof val === 'string') arr.push({ key, label: key, href: val });
            else arr.push({ key, label: val.label ?? key, href: val.href, target: val.target });
          }
        }
        return arr;
      }
      return [];
    },
  },
  template: /* html */ `
    <nav class="navbar">
      <div class="navbar__inner">
        <div class="navbar__brand">takoBox</div>
        <ul class="navbar__menu">
          <li v-for="(item, i) in normalizedItems" :key="item.key || i">
            <a :href="item.href" :target="item.target || null">{{ item.label }}</a>
          </li>
        </ul>
      </div>
    </nav>
  `,
};
