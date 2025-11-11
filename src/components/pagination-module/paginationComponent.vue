<!-- components/pagination-module/paginationComponent.vue -->
<template lang="pug">
.pagination-wrapper
  .controls
    label
      | 每頁顯示數
      select(v-model.number="pageSize" @change="changeSize(pageSize)")
        option(v-for="option in pageSizeOptions" :key="option" :value="option") {{ option }}

  ul.userBox
    li(v-for="(user, ind) in paginatedItems" :key="user.id || ind")
      div
        b.nbr {{ ind + 1 }}
        span(v-for="field in displayColumns" :style="{ flex: (fieldDisplayMap[field]?.flex || 1) }" :key="field") {{ user[field] ?? '不提供' }}
        b.showsetBtn(v-if="showset && user.age !== '不提供'" @click="showModal('修改用戶資料', user)" title="修改")
          i.fa.fa-cog

    // 補空白行讓高度固定
    li.blank-row(v-for="n in pageSize - paginatedItems.length" :key="'blank-' + n")
      div &nbsp;

  .pagination
    button(:disabled="currentPage === 1" @click="changePage(currentPage - 1)") 上一頁
    span 第 {{ currentPage }} / {{ totalPages }} 頁
    button(:disabled="currentPage === totalPages" @click="changePage(currentPage + 1)") 下一頁

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
  name: 'paginationComponent',
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

<style scoped>
@charset "UTF-8";
.pagination-wrapper { font-family: sans-serif; border: 1px solid #ccc; padding: 1em; border-radius: 8px; box-shadow: 0 0 10px #ccc; }
.pagination-wrapper .controls { margin-bottom: .5em; }
.pagination-wrapper .pagination { display: flex; align-items: center; justify-content: space-between; margin-top: .5em; }
ul.userBox { border: 1px solid #bbbbbb; position: relative; }
ul.userBox li { border-top: 1px solid #bbbbbb; flex: 1; display: inline-flex; align-items: center; width: 100%; box-sizing: border-box; }
ul.userBox li:first-child { border-top: 0; }
ul.userBox li:nth-child(2n) { background-color: #f1f1f1; }
ul.userBox li:hover { position: relative; }
ul.userBox li:hover div { transform: scale(1.025); }
ul.userBox li div { width: 100%; display: inline-flex; align-items: center; padding: .5em 0; transition: .35s; }
ul.userBox li .nbr { width: 2em; text-align: center; margin-right: .5em; color: #d36a9d; }
ul.userBox li div span { flex: 1; padding: .25em .5em; }
ul.userBox li div .showsetBtn { border: 2px solid #ffffff; padding: .25em .5em; border-radius: 8px; background-color: #f34a99; margin-left: 1em; color: #fff; cursor: pointer; display: inline-flex; }
.blank-row { opacity: .3; pointer-events: none; }
</style>

