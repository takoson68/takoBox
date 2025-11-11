// @/pages/playground/index.js

import { createVueApp, defineComponent } from "@Vue";
import Components from '@/components/components.js'  // 路徑依你實際調整
import vueComponents from '@/components/vueComponents.js'  // 路徑依你實際調整

export const initPage = async ({ container, api }) => {
  const App = defineComponent({
    name: "playgroundApp",
    template: `
      <DefaultLayout :showMenu="showMenu" :indexPage="indexPage" :testBox="testBox">
     

        <template #conApp>
          <div class="conApp">
            <h3>Components Playground</h3>
            <newComponent />
            <componentTemplate />
            <hr>
            <PaginationComponent :showset="true" :editable-fields="editableFields" :items="items" :columns="columns"/>
            <hr>
            <listUseStarTemp :items="items"/>
            <hr>
            <tableComponent :users="indexMonth" :showset="true" :editable-fields="editableFields"/>
          </div>
        </template>
      </DefaultLayout>
    `,
    data() {
      return {
        indexPage: "playground",
        testBox: "Components playground 測試頁",
        showMenu: true,
        items: [],
        users: [],
        indexMonth: [],
        indexMonthTitle: '',
        editableFields: [['id','帳號'], ['name','暱稱'], ['age','年齡'], ['email','聯絡信箱']],
        columns: ['name', 'email', 'age', 'date'],
      };
    },
    created() {
      this.callData();
    },
    methods: {
      async callData() {
        try {
          const data = await api.get('/api/data');
          this.items = data.data
          this.users = data.data
          const currentMonth = new Date().toISOString().slice(0, 7);
          this.indexMonth = this.getUsersByMonth(this.users, currentMonth);
        } catch (error) {
          console.error('Error:', error);
        }
      },
      onDateSelected(date) {
        if (typeof date === "string") {
          this.indexMonthTitle = date 
          this.indexMonth = this.getUsersByMonth(this.users, date);
        }
      },
      getUsersByMonth(users, month) {
        let mhData = users.filter(user => {
          const userMonth = user.date.slice(0, 7);
          return userMonth === month;
        });
        if(mhData.length===0){
          mhData = [{ id:'000000', name:'不提供', email:'不提供', date:'不提供', age:'不提供' }]
        }
        return mhData
      },
    },
  });

  const app = createVueApp(App);
  // 優先使用 SFC 集合，若未編譯則退回 components.js
  // app.use(Components)
  app.use(vueComponents)

  app.mount("#app");
};
