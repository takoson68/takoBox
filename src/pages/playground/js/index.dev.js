"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initPage = void 0;

var _Vue = require("@Vue");

var _components = _interopRequireDefault(require("@/components/components.js"));

var _vueComponents = _interopRequireDefault(require("@/components/vueComponents.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// @/pages/playground/index.js
// 路徑依你實際調整
// 路徑依你實際調整
var initPage = function initPage(_ref) {
  var container, api, App, app;
  return regeneratorRuntime.async(function initPage$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          container = _ref.container, api = _ref.api;
          App = (0, _Vue.defineComponent)({
            name: "playgroundApp",
            template: "\n      <DefaultLayout :showMenu=\"showMenu\" :indexPage=\"indexPage\" :testBox=\"testBox\">\n     \n\n        <template #conApp>\n          <div class=\"conApp\">\n            <h3>Components Playground</h3>\n            <newComponent />\n            <componentTemplate />\n            <hr>\n            <PaginationComponent :showset=\"true\" :editable-fields=\"editableFields\" :items=\"items\" :columns=\"columns\"/>\n            <hr>\n            <listUseStarTemp :items=\"items\"/>\n            <hr>\n            <tableComponent :users=\"indexMonth\" :showset=\"true\" :editable-fields=\"editableFields\"/>\n          </div>\n        </template>\n      </DefaultLayout>\n    ",
            data: function data() {
              return {
                indexPage: "playground",
                testBox: "Components playground 測試頁",
                showMenu: true,
                items: [],
                users: [],
                indexMonth: [],
                indexMonthTitle: '',
                editableFields: [['id', '帳號'], ['name', '暱稱'], ['age', '年齡'], ['email', '聯絡信箱']],
                columns: ['name', 'email', 'age', 'date']
              };
            },
            created: function created() {
              this.callData();
            },
            methods: {
              callData: function callData() {
                var data, currentMonth;
                return regeneratorRuntime.async(function callData$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return regeneratorRuntime.awrap(api.get('/api/data'));

                      case 3:
                        data = _context.sent;
                        this.items = data.data;
                        this.users = data.data;
                        currentMonth = new Date().toISOString().slice(0, 7);
                        this.indexMonth = this.getUsersByMonth(this.users, currentMonth);
                        _context.next = 13;
                        break;

                      case 10:
                        _context.prev = 10;
                        _context.t0 = _context["catch"](0);
                        console.error('Error:', _context.t0);

                      case 13:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, null, this, [[0, 10]]);
              },
              onDateSelected: function onDateSelected(date) {
                if (typeof date === "string") {
                  this.indexMonthTitle = date;
                  this.indexMonth = this.getUsersByMonth(this.users, date);
                }
              },
              getUsersByMonth: function getUsersByMonth(users, month) {
                var mhData = users.filter(function (user) {
                  var userMonth = user.date.slice(0, 7);
                  return userMonth === month;
                });

                if (mhData.length === 0) {
                  mhData = [{
                    id: '000000',
                    name: '不提供',
                    email: '不提供',
                    date: '不提供',
                    age: '不提供'
                  }];
                }

                return mhData;
              }
            }
          });
          app = (0, _Vue.createVueApp)(App); // 優先使用 SFC 集合，若未編譯則退回 components.js
          // app.use(Components)

          app.use(_vueComponents["default"]);
          app.mount("#app");

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.initPage = initPage;