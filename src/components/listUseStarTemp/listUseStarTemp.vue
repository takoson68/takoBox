<!-- components/listUseStarTemp/listUseStarTemp.vue -->
<template lang="pug">
ul.userBox
  li(v-for="(user,ind) in items" :key="user.id")
    div
      b.nbr {{ ind + 1 }}
      span {{ user.name }} - {{ user.age }}
      span
        ratingStarComponent(v-model:score="user.star")
      span {{ user.email }}
      span {{ user.date }}
      b.showsetBtn(v-if="showset" v-show="user.age!=='不提供'" @click="showModal('修改用戶資料', user)" title="修改")
        i.fa.fa-cog
</template>

<script>
export default {
  name: 'listUseStarTemp',
  props: { items: { type: [Array, Object], required: true, default: () => [] } }
}
</script>

<style scoped>
.listUseStarTemp-template {
  padding: 1rem;
  background: #f2f2f2;
  border: 1px dashed #999;
}
</style>

