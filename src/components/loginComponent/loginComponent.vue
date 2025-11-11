<!-- components/loginComponent/loginComponent.vue -->
<template lang="pug">
form.login-form(@submit="onSubmit" aria-label="登入表單")
  label(for="username")
    b(data-lang="cont_lang_03") 帳號
    input#username(type="text" v-model="username" required autocomplete="username" data-i18n-placeholder="cont_lang_01" aria-required="true")
  label(for="password")
    b(data-lang="cont_lang_04") 密碼
    input#password(type="password" v-model="password" required autocomplete="current-password" data-i18n-placeholder="cont_lang_02" aria-required="true")
  .btnBox
    button(type="button" @click="cancelLogin") 取消
    button(type="submit" data-lang="cont_lang_05") 登入
</template>

<script>
import { ref, onMounted } from '@Vue'
import { container } from "@/containers/index-dist.js";
const langStore = container.resolve("languageStore");

export default {
  name: 'loginComponent',
  emits: ['submit','cancel'],
  setup(_, { emit }){
    const username = ref('admin')
    const password = ref('123456')

    const onSubmit = (e)=>{
      e.preventDefault()
      if(!username.value || !password.value){
        alert('請輸入帳號或密碼')
        return
      }
      emit('submit', { username: username.value, password: password.value })
    }
    const cancelLogin = ()=> emit('cancel')

    onMounted(()=>{ langStore.replaceMenuLang() })

    return { username, password, onSubmit, cancelLogin }
  }
}
</script>

<style scoped>
/* 使用全域樣式/頁面樣式控制表單風格 */
</style>

