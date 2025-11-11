<!-- components/tableComponent/tableComponent.vue -->
<template lang="pug">
.tableComponent
  ul.userBox
    li(v-for="(user,ind) in users" :key="user.id")
      div
        b.nbr {{ ind + 1 }}
        span {{ user.name }} - {{ user.age }}
        span {{ user.email }}
        span {{ user.date }}
        b.showsetBtn(v-if="showset" v-show="user.age!=='不提供'" @click="showModal('修改用戶資料', user)" title="修改")
          i.fa.fa-cog
  modalComponent(
    v-if="modalData"
    :title="modalTitle"
    :data="modalData"
    :editable-fields="editableFields"
    @close="closeModal"
    @save="saveData"
  )
</template>

<script>
export default {
  name: 'tableComponent',
  props: ['users','showset','editableFields'],
  data(){
    return { modalTitle: '', modalData: null }
  },
  methods: {
    showModal(title, data){ this.modalTitle = title; this.modalData = data },
    closeModal(){ this.modalData = null },
    saveData(updatedData){
      const userIndex = this.users.findIndex(user => user.id === updatedData.id)
      if (userIndex !== -1) {
        this.users[userIndex] = { ...updatedData }
      }
      this.closeModal()
    }
  }
}
</script>

<style scoped>
.tableComponent-template {
  padding: 1rem;
  background: #f2f2f2;
  border: 1px dashed #999;
}
</style>

