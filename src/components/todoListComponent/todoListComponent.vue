<!-- components/todoListComponent/todoListComponent.vue -->
<template lang="pug">
.todo-container
  h2 📝 待辦清單
  hr
  input.todo-input(
    v-model="newItem"
    type="text"
    placeholder="輸入待辦"
    @keyup.enter="addItem"
  )
  ul.todo-list
    li(v-for="(item, index) in items" :key="index")
      span(@click="toggleItem(index)")
        | {{ item.text }}
        br
        small {{ item.createdAt }}
      button(@click="removeItem(index)") 刪除
</template>

<script>
import { container } from '@/containers/index-dist.js'
const todoStore = container.resolve('todoStore')

export default {
  name: 'todoListComponent',
  data(){ return { newItem:'', items: todoStore.get() } },
  methods: {
    addItem(){
      const text = this.newItem.trim(); if(!text) return
      const now = new Date();
      const timestamp = now.toLocaleString('zh-TW', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false })
      todoStore.addItem({ text, createdAt: timestamp });
      this.newItem = ''
    },
    toggleItem(index){},
    removeItem(index){ todoStore.removeItem(index) }
  }
}
</script>

<style scoped>
.todo-container { padding: 1rem; border: 1px solid #ccc; border-radius: 8px; max-width: 400px; }
.todo-input { width: 100%; padding: .5rem; margin-bottom: 1rem; }
ul.todo-list { padding: 0; }
ul.todo-list li { display: flex; justify-content: flex-start; align-items: center; padding: .5rem; border-bottom: 1px dashed #ddd; counter-increment: my-counter; position: relative; transition: .35s; }
ul.todo-list li::before { content: "(" counter(my-counter) ")"; }
ul.todo-list li:hover { background-color: #eee; padding-left: 1em; }
ul.todo-list li button { position: absolute; right: .5em; z-index: 1; border-radius: 8px; background-color: #f16e11; border: solid 2px #ffc4c4; color: #fff; }
ul.todo-list li span { cursor: pointer; padding: .5em; display: flex; flex: 1; align-items: center; }
ul.todo-list li span.done { text-decoration: line-through; color: gray; }
ul.todo-list li span small { position: absolute; right: 3rem; background-color: #28aa28; border: solid 2px #72da72; padding: .5em 1em; border-radius: 8px; color: #fff; font-size: .6em; }
</style>

