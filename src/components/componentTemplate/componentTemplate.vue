<!-- components/componentTemplate/componentTemplate.vue -->
<template lang="pug">
.component-template
  h2 {{ myTest.name }}
  p 這是元件模板!!!!!
  p 資料透過 mytestComponent 模板使用 store 更新，支援跨元件同步資料
</template>

<script>
import { container } from "@/containers/index-dist.js";
const tempStore = container.resolve('tempStore')

export default {
  name: 'componentTemplate',
  data(){ return { myTest: tempStore.get().myTest||{} } },
}
</script>

<style scoped>
.component-template {
  padding: 1rem;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  font-family: sans-serif;
  border-radius: .5em;
  color: green;
}
</style>

