<!-- components/coverComponent/coverComponent.vue -->
<template lang="pug">
.modal-overlay
  .modal
    h2(v-if="title") {{ title }}
    .modal-content
      slot
    span.clo(@click="closeModal" title="關閉") X
  .bgEvent(@click="closeModal")
</template>

<script>
export default {
  name: 'coverComponent',
  props: ['title'],
  methods: {
    closeModal(){ this.$emit('close') }
  }
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

