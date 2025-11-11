<!-- components/menuComponent/menuComponent.vue -->
<template lang="pug">
nav.topMenu
  ul
    li(v-for="route in routes" :key="route.path" :class="route.component.toLowerCase()===indexUrl?'pickLi':''")
      a(v-if="route.path !== ''" :href="route.path" :data-lang="route.meta.lang")
      a(v-if="route.path === ''" :data-lang="route.meta.lang") {{ langDD[route.meta.lang] }}
      ul(v-if="route.children && route.children.length > 0" :id="'i18n-'+route.component")
        li(v-for="child in route.children" :key="child.path || child.component")
          a(v-if="child.path !== ''" :href="child.path" :data-lang="child.meta.lang") {{ langDD[child.meta.lang] }}
          a(v-if="child.path === ''" @click="setLangDD(child.component)" :id="'i18n-'+child.component" :data-lang="child.meta.lang") {{ langDD[child.meta.lang] }}

  button.login_btn(v-can="'post:edit'" @click="logout")
    b 登出
  button.login_btn(v-if="!token" @click="toggleLogin")
    i.fa.fa-address-card(aria-hidden="true")
    b(data-lang="cont_lang_05") 登入

  .bgGary(v-if="showLogin")
    loginComponent(@submit="handleLogin" @cancel="cancelLogin")
</template>

<script>
import { nextTick } from "@Vue";
import { container } from "@/containers/index-dist.js";
import { api } from "@/api/index-dist.js";

const menuStore = container.resolve("menuStore");
const tokenStore = container.resolve("tokenStore");
const langStore = container.resolve("languageStore");
const permissionStore = container.resolve('permissionStore')

export default {
  name: 'menuComponent',
  data() {
    return {
      routes: menuStore.get()||[],
      showLogin: false,
      langDD: langStore.langData,
      language: langStore.getLanguage(),
      token: tokenStore.get()||'',
      indexUrl: container.resolve("urlUtils").getPageName().toLowerCase(),
    };
  },
  created() {
    if (!this.routes.length) {
      api.get("/api/menu").then((res) => {
        const menu = res.data;
        menuStore.set(menu);
        this.routes = menu;
      });
    }
    if (!tokenStore.get()) {
      this.showLogin = true;
    }
  },
  methods: {
    async setLangDD(lang) {
      await langStore.setLanguage(lang);
      this.langDD = langStore.getLangData();
      await nextTick();
      langStore.replaceMenuLang();
    },
    toggleLogin() { this.showLogin = !this.showLogin },
    handleLogin(payload) {
      api.post("/api/login", payload).then((res) => {
        if (res.code === 200) {
          const token = res.token;
          tokenStore.set(token);
          const permissions = res.permissions;
          permissionStore.set(permissions)
          location.reload()
        } else {
          alert(res.message);
        }
      });
    },
    cancelLogin() { this.showLogin = false },
    logout(){ tokenStore.clear(); permissionStore.clear(); location.reload() },
  },
  mounted() { this.setLangDD(this.language) },
}
</script>

<style scoped>
.pickLi { border-bottom: 3px solid red !important; }
</style>
