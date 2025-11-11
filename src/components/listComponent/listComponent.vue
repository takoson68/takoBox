<!-- components/listComponent/listComponent.vue -->
<template lang="pug">
nav.listMenu
  ul
    li(v-for="route in routes" :key="route.path")
      // 使用成對 v-if，避免 v-else 解析問題
      a(v-if="route.path !== ''" :href="route.path" :data-lang="route.meta.lang") {{ route.meta.title }}
      a(v-if="route.path === ''" :id="'i18n-'+route.component" :data-lang="route.meta.lang") {{ route.meta.title }}

      ul(v-if="route.children && route.children.length > 0")
        li(v-for="child in route.children" :key="child.path || child.component")
          a(v-if="child.path !== ''" :href="child.path" :data-lang="child.meta.lang") {{ child.meta.title }}
          a(v-if="child.path === ''" :id="'i18n-'+route.component" :data-lang="child.meta.lang") {{ child.meta.title }}
</template>

<script>
import { container } from "@/containers/index-dist.js";
import { api } from "@/api/index-dist.js";
const menuStore = container.resolve("menuStore");

export default {
  name: 'listComponent',
  data() {
    return { routes: menuStore.get() };
  },
  created() {
    if (!this.routes) {
      api.get("/api/menu").then((res) => {
        const menu = res.data;
        menuStore.set(menu);
        this.routes = menu;
      });
    }
  },
}
</script>

<style scoped>
.listComponent-template {
  padding: 1rem;
  background: #f2f2f2;
  border: 1px dashed #999;
}
</style>
