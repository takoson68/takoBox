<!-- components/PaginationComponent/PaginationComponent.vue -->
<template lang="pug">
.pagination-wrapper
  .controls
    label 每頁顯示：
      select(v-model.number="pageSize", @change="changeSize(pageSize)")
        option(v-for="option in pageSizeOptions", :key="option", :value="option") {{ option }}
  ul.userBox
    li(v-for="(user, ind) in paginatedItems", :key="user.id || ind")
      div
        b.nbr {{ ind + 1 }}
        span(v-for="field in displayColumns", :style="{ flex: (fieldDisplayMap[field]?.flex || 1) }", :key="field") {{ user[field] ?? &apos;無資料&apos; }}
        b.showsetBtn(v-if="showset && user.age !== '無資料'", @click="showModal('修改用戶資訊', user)", title="修改")
          i.fa.fa-cog
    li.blank-row(v-for="n in pageSize - paginatedItems.length", :key="'blank-' + n")
      div 
  .pagination
    button(:disabled="currentPage === 1", @click="changePage(currentPage - 1)") 上一頁
    span 第
      | {{ currentPage }}
      | /
      | {{ totalPages }}
      | 頁
    button(:disabled="currentPage === totalPages", @click="changePage(currentPage + 1)") 下一頁
  modalComponent(v-if="modalData", :title="modalTitle", :data="modalData", :editable-fields="editableFields", @close="closeModal", @save="saveData")

</template>

<script>
export default {
  name: 'PaginationComponent',
  props: {
    items: { type: [Array, Object], required: true, default: () => [] },
    pageSizeOptions: { type: Array, default: () => [5,10,20,30], validator: (val)=> val.every(n=> typeof n==='number') },
    columns: { type: Array, default: () => [] },
    showset: { type: Boolean, default: false },
  },
  data(){
    return {
      currentPage: 1,
      pageSize: 5,
      modalTitle: '',
      modalData: null,
      editableFields: [['id','帳號'],['name','暱稱'],['age','年齡'],['email','聯絡信箱']],
      dataFlex: [['id','帳號',3],['name','暱稱',5],['age','年齡',1],['email','聯絡信箱',6],['date','日期',3]],
    }
  },
  computed: {
    normalizedItems(){ if(Array.isArray(this.items)) return this.items; if(this.items && typeof this.items==='object') return Object.values(this.items); return [] },
    totalPages(){ return Math.ceil(this.normalizedItems.length / this.pageSize) },
    paginatedItems(){ const start=(this.currentPage-1)*this.pageSize; return this.normalizedItems.slice(start, start+this.pageSize) },
    displayColumns(){ if(this.columns.length>0) return this.columns; const first=this.paginatedItems[0]; return first? Object.keys(first):[] },
    fieldDisplayMap(){ const map={}; this.dataFlex.forEach(([key,label,flex=1])=>{ map[key]={label,flex} }); return map },
  },
  methods: {
    changePage(p){ this.currentPage = p },
    changeSize(s){ this.pageSize = s; this.currentPage = 1 },
    showModal(title,data){ this.modalTitle=title; this.modalData=data },
    closeModal(){ this.modalData=null },
    saveData(updated){ const idx=this.items.findIndex(u=>u.id===updated.id); if(idx!==-1){ this.items[idx] = { ...updated } } this.closeModal() },
  }
}
</script>

<style lang="stylus" scoped >


.pagination-wrapper
  font-family: sans-serif
  border: 1px solid #ccc
  padding: 1em
  border-radius: 8px
  box-shadow: 0 0 10px #ccc

  .controls
    margin-bottom: 0.5em

  .pagination
    display: flex
    align-items: center
    justify-content: space-between
    margin-top: 0.5em
  

ul.userBox
  // margin: 1em
  border: 1px solid #bbbbbb
  position: relative
  li 
    border-top: 1px solid #bbbbbb
    flex: 1
    display: inline-flex
    align-items: center
    // justify-content: space-between
    width: 100%
    box-sizing: border-box
    &:first-child
      border-top: 0px solid red
    &:nth-child(2n)
      background-color: #f1f1f1
    &:hover 
      position: relative
      div 
        transform: scale(1.025)
        background-color: #ffffff
        border: 1px solid #cccccc
        z-index: 1
        box-shadow: 0 0 .5em #bbbbbb
        border-radius: .5em
    div 
      display: flex
      align-items: center
      width: 100%
      min-height: 2.25em
      padding: 1em
      transition: 0.35s
      border: 1px solid #ffffff00

    span 
      flex: 2
      display: inline-flex
      & + span 
        flex: 1
        padding-left: .5em
        justify-content: right
        text-align: right
        // min-width: 5em
    .nbr
      font-size: .7em
      display: flex
      justify-content: center
      align-items: center
      height: 2.2em
      width: 2.2em
      display: inline-flex
      border-radius: 2em
      background-color: #8bc34a
      color: #ffffff
      margin-right: 1em

.showsetBtn
  padding: .25em .5em   
  background-color: red 
  border-radius: .25em 
  margin-left: 1em
  color: #ffffff
  cursor: pointer
  display: inline-flex

/* 讓空白列保持一致高度 */
.blank-row
  opacity: 0.3
  pointer-events: none

</style>

