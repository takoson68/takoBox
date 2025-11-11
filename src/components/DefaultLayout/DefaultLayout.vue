<!-- components/DefaultLayout/DefaultLayout.vue -->
<template lang="pug">
.layout-container
  header.layout-header
    menuComponent

  main(:class="'layout-main' + ' ' + indexPage")
    .containerBox
      listComponent(v-if="showMenu")

      // 左側 slot（例如行事曆區塊）
      slot(name="coverNoMemu")

      // 主要內容 slot
      slot(name="conApp")

  footer.layout-footer
    p © 2025 My Website
      b(v-if="!!testBox") {{ ' ' + testBox }}
</template>

<script>
export default {
  name: 'DefaultLayout',
  props: {
    indexPage: { type: String, required: false, default: '' },
    showMenu: { type: Boolean, required: false, default: true },
    testBox: { type: String, required: false },
  },
}
</script>

<style scoped>
/* 無既定樣式，保留由全站樣式控制 */
</style>

