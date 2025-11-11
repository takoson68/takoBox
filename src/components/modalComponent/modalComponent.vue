<!-- components/modalComponent/modalComponent.vue -->
<template lang="pug">
coverComponent(:title="title" @close="closeModal")
  form(@submit.prevent="handleSave")
    .form-item(v-for="field in editableFields" :key="field[0]")
      label(:for="field[0]") {{ field[1] }}
      // 避免 v-else 解析問題，改用相容的 v-if 分支
      input(type="checkbox" :id="field[0]" v-if="isBooleanField(localData[field[0]])" v-model="localData[field[0]]")
      input(:type="getInputType(localData[field[0]])" :id="field[0]" v-if="isTextField(localData[field[0]]) && !isBooleanField(localData[field[0]])" v-model="localData[field[0]]")
      input(type="text" :id="field[0]" v-if="!isTextField(localData[field[0]]) && !isBooleanField(localData[field[0]])" v-model="localData[field[0]]")
    .actions
      button(type="button" @click="closeModal") 取消
      button(type="submit") 保存
</template>

<script>
export default {
  name: 'modalComponent',
  props: ['title','data','editableFields'],
  data(){
    return { localData: Object.assign({}, this.data) }
  },
  methods: {
    handleSave(){ this.$emit('save', this.localData) },
    closeModal(){ this.$emit('close') },
    getInputType(value){
      if (typeof value === 'number') return 'number'
      if (typeof value === 'string') return value.includes('@') ? 'email' : 'text'
      if (Object.prototype.toString.call(value) === '[object Date]') return 'date'
      return 'text'
    },
    isTextField(value){ return typeof value === 'string' || typeof value === 'number' },
    isBooleanField(value){ return typeof value === 'boolean' },
  }
}
</script>

<style scoped>
.modalComponent-template {
  padding: 1rem;
  background: #44e35c;
  border: 1px dashed #999;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2em;
  height: 2em;
}
</style>
