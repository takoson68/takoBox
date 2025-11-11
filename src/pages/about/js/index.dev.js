"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initPage = void 0;

var _Vue = require("@Vue");

var _components = _interopRequireDefault(require("@/components/components.js"));

var _vueComponents = _interopRequireDefault(require("@/components/vueComponents.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// @/pages/about/index.js
// 路徑依你實際調整
// 路徑依你實際調整
var initPage = function initPage(_ref) {
  var container, api, tokenStore, App, app;
  return regeneratorRuntime.async(function initPage$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          container = _ref.container, api = _ref.api;
          // 可加載資料、做權限驗證、登入等
          tokenStore = container.resolve("tokenStore");
          App = (0, _Vue.defineComponent)({
            name: "aboutApp",
            template: "\n      <DefaultLayout :testBox=\"testBox\">\n        <template #conApp>\n          <div class=\"conApp\">\n            <newComponent />\n            <mytestComponent />\n            <componentTemplate />\n            <hr>\n            <PaginationComponent :showset=\"true\" :editable-fields=\"editableFields\" :items=\"items\" :columns=\"columns\"/>\n            <hr>\n            <listUseStarTemp :items=\"items\"/>\n            \n          </div>\n        </template>\n      </DefaultLayout>\n    ",
            data: function data() {
              return {
                indexPage: "about",
                testBox: "這是 about 頁面的內容",
                items: [],
                // items: Array.from({ length: 42 }, (_, i) => `項目 ${i + 1}`)
                editableFields: [['id', '帳號'], ['name', '名稱'], ['age', '年齡'], ['email', '電子信箱']],
                // 僅允許修改 `name` 和 `email`,'age'
                //- columns 想要顯示的參數
                columns: ['name', 'email', 'age', 'date'],
                rating: 3
              };
            },
            created: function created() {
              //- 取得跨頁資訊--------------------
              var pageDataBridge = container.resolve("pageDataBridge");
              var receivedData = pageDataBridge.receive();
              console.log("跨頁資料：", receivedData);
              this.callData();
            },
            methods: {
              callData: function callData() {
                var data;
                return regeneratorRuntime.async(function callData$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return regeneratorRuntime.awrap(api.get('/api/data'));

                      case 2:
                        data = _context.sent;
                        this.items = data.data;
                        console.log('Data:', data.data);

                      case 5:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, null, this);
              }
            }
          });
          app = (0, _Vue.createVueApp)(App); // DefaultLayout 從這邊載入註冊

          app.use(_components["default"]);
          app.use(_vueComponents["default"]);
          app.mount("#app");

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.initPage = initPage;