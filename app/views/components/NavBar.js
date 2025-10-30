export default {
  name: 'NavBar',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  template: /* html */ `
    <nav class="navbar">
      <div class="navbar__inner">
        <div class="navbar__brand">takoBox</div>
        <ul class="navbar__menu">
          <li v-for="(item, i) in items" :key="i">
            <a :href="item.href">{{ item.label }}</a>
          </li>
        </ul>
      </div>
    </nav>
  `,
};

