import { container } from '@/containers/index-dist.js';
import { createElementBlock, openBlock, createElementVNode, toDisplayString, Fragment, renderList, normalizeClass, createCommentVNode, renderSlot, resolveComponent, createVNode, createBlock, createTextVNode, withDirectives, vShow, vModelText, resolveDirective, withCtx, withModifiers, vModelCheckbox, vModelDynamic, vModelSelect, normalizeStyle, withKeys } from '@Vue';
import { api } from '@/api/index-dist.js';
import { ref, onMounted, nextTick } from '@Vue';

var script$f = {
  name: "calendarComponent",
  props: { indexMonth: { type: [Array, String], default: () => [] } },
  data() {
    return {
      weekDays: ["\u65E5", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D"],
      today: /* @__PURE__ */ new Date(),
      year: (/* @__PURE__ */ new Date()).getFullYear(),
      month: (/* @__PURE__ */ new Date()).getMonth(),
      selectedDate: null,
      rangeSelectedDates: [],
      highlightedDates: []
    };
  },
  computed: {
    days() {
      const startOfMonth = new Date(this.year, this.month, 1);
      const endOfMonth = new Date(this.year, this.month + 1, 0);
      const daysInMonth = endOfMonth.getDate();
      const dates = [];
      const startDayOfWeek = startOfMonth.getDay();
      for (let i = 0; i < startDayOfWeek; i++) dates.push({ date: null, isCurrentMonth: false, dateIndex: `empty-before-${i}` });
      for (let i = 1; i <= daysInMonth; i++) {
        const isToday = this.year === this.today.getFullYear() && this.month === this.today.getMonth() && i === this.today.getDate();
        const dayOfWeek = new Date(this.year, this.month, i).getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        dates.push({ date: i, isCurrentMonth: true, isToday, isWeekend, dateIndex: `current-${i}` });
      }
      const remaining = 42 - dates.length;
      for (let i = 0; i < remaining; i++) dates.push({ date: null, isCurrentMonth: false, dateIndex: `empty-after-${i}` });
      return dates;
    }
  },
  methods: {
    prevMonth() {
      if (this.month === 0) {
        this.month = 11;
        this.year -= 1;
      } else {
        this.month -= 1;
      }
      this.selectedDate = null;
      this.$emit("date-selected", `${this.year}-${this.month * 1 < 9 ? "0" + (this.month * 1 + 1) : this.month * 1 + 1}`);
    },
    nextMonth() {
      if (this.month === 11) {
        this.month = 0;
        this.year += 1;
      } else {
        this.month += 1;
      }
      this.selectedDate = null;
      this.$emit("date-selected", `${this.year}-${this.month * 1 < 9 ? "0" + (this.month * 1 + 1) : this.month * 1 + 1}`);
    },
    handleDateClick(day) {
      if (day.date && day.isCurrentMonth) {
        const selected = { date: day.date, month: this.month, year: this.year };
        if (this.rangeSelectedDates.length > 0) {
          this.selectedDate = null;
          this.rangeSelectedDates = [];
          return;
        } else if (this.selectedDate && (this.selectedDate.date !== selected.date || this.selectedDate.month !== selected.month || this.selectedDate.year !== selected.year)) {
          const rangeStart = this.selectedDate;
          const rangeEnd = selected;
          const [start, end] = this.getOrderedRange(rangeStart, rangeEnd);
          this.markRangeAsSelected(start, end);
        } else {
          this.selectedDate = null;
          this.rangeSelectedDates = [];
        }
        this.selectedDate = selected;
        this.$emit("date-selected", this.rangeSelectedDates.length ? this.rangeSelectedDates : this.selectedDate);
      }
    },
    getOrderedRange(start, end) {
      const s = new Date(start.year, start.month, start.date);
      const e = new Date(end.year, end.month, end.date);
      return s <= e ? [start, end] : [end, start];
    },
    markRangeAsSelected(start, end) {
      this.rangeSelectedDates = [];
      const s = new Date(start.year, start.month, start.date);
      const e = new Date(end.year, end.month, end.date);
      let c = s;
      while (c <= e) {
        this.rangeSelectedDates.push({ date: c.getDate(), month: c.getMonth(), year: c.getFullYear() });
        c.setDate(c.getDate() + 1);
      }
    },
    getDateClass(day) {
      const isInRange = this.rangeSelectedDates.some((d) => d.date === day.date && d.month === this.month && d.year === this.year);
      return {
        "calendar-date--disabled": !day.isCurrentMonth,
        "calendar-date--today": day.isToday,
        "calendar-date--weekend": day.isWeekend,
        "calendar-date--selected": isInRange || this.selectedDate && this.selectedDate.date === day.date && this.selectedDate.month === this.month && this.selectedDate.year === this.year,
        "calendar-date--highlighted": this.isHighlighted(day)
      };
    },
    isHighlighted(day) {
      if (!day.date || !day.isCurrentMonth) return false;
      const formattedDate = `${this.year}-${String(this.month + 1).padStart(2, "0")}-${String(day.date).padStart(2, "0")}`;
      return Array.isArray(this.indexMonth) && this.indexMonth.some((d) => d.date === formattedDate);
    }
  },
  mounted() {
    setTimeout(() => {
      const otherStore = container.resolve("otherStore");
      this.highlightedDates = otherStore.get(this.highlightedDates);
    }, 250);
  }
};

const _hoisted_1$f = { class: "calendarTemp" };
const _hoisted_2$c = { class: "calendar-header" };
const _hoisted_3$b = { class: "calendar-body" };
const _hoisted_4$9 = { class: "calendar-week" };
const _hoisted_5$6 = { class: "calendar-dates" };
const _hoisted_6$4 = ["onClick"];
function render$f(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$f, [
    createElementVNode("div", _hoisted_2$c, [
      createElementVNode("button", {
        class: "prev",
        onClick: _cache[0] || (_cache[0] = (...args) => $options.prevMonth && $options.prevMonth(...args))
      }, "\u4E0A\u500B\u6708"),
      createElementVNode(
        "span",
        null,
        toDisplayString($data.year) + " \u5E74" + toDisplayString($data.month + 1) + " \u6708",
        1
        /* TEXT */
      ),
      createElementVNode("button", {
        class: "next",
        onClick: _cache[1] || (_cache[1] = (...args) => $options.nextMonth && $options.nextMonth(...args))
      }, "\u4E0B\u500B\u6708")
    ]),
    createElementVNode("div", _hoisted_3$b, [
      createElementVNode("div", _hoisted_4$9, [
        (openBlock(true), createElementBlock(
          Fragment,
          null,
          renderList($data.weekDays, (day) => {
            return openBlock(), createElementBlock(
              "span",
              { key: day },
              toDisplayString(day),
              1
              /* TEXT */
            );
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      createElementVNode("div", _hoisted_5$6, [
        (openBlock(true), createElementBlock(
          Fragment,
          null,
          renderList($options.days, (day) => {
            return openBlock(), createElementBlock("span", {
              class: normalizeClass(["calendar-date", $options.getDateClass(day)]),
              key: day.dateIndex,
              onClick: ($event) => $options.handleDateClick(day)
            }, toDisplayString(day.date || ""), 11, _hoisted_6$4);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])
    ])
  ]);
}

script$f.render = render$f;
script$f.__scopeId = "data-v-46a5974f";
script$f.__file = "src/components/calendarComponent/calendarComponent.vue";

const tempStore$2 = container.resolve("tempStore");
var script$e = {
  name: "componentTemplate",
  data() {
    return { myTest: tempStore$2.get().myTest || {} };
  }
};

const _hoisted_1$e = { class: "component-template" };
function render$e(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$e, [
    createElementVNode(
      "h2",
      null,
      toDisplayString($data.myTest.name),
      1
      /* TEXT */
    ),
    _cache[0] || (_cache[0] = createElementVNode(
      "p",
      null,
      "\u9019\u662F\u5143\u4EF6\u6A21\u677F!!!!!",
      -1
      /* CACHED */
    )),
    _cache[1] || (_cache[1] = createElementVNode(
      "p",
      null,
      "\u8CC7\u6599\u900F\u904E mytestComponent \u6A21\u677F\u4F7F\u7528 store \u66F4\u65B0\uFF0C\u652F\u63F4\u8DE8\u5143\u4EF6\u540C\u6B65\u8CC7\u6599",
      -1
      /* CACHED */
    ))
  ]);
}

script$e.render = render$e;
script$e.__scopeId = "data-v-0a66f3bf";
script$e.__file = "src/components/componentTemplate/componentTemplate.vue";

var script$d = {
  name: "coverComponent",
  props: ["title"],
  methods: {
    closeModal() {
      this.$emit("close");
    }
  }
};

const _hoisted_1$d = { class: "modal-overlay" };
const _hoisted_2$b = { class: "modal" };
const _hoisted_3$a = { key: 0 };
const _hoisted_4$8 = { class: "modal-content" };
function render$d(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$d, [
    createElementVNode("div", _hoisted_2$b, [
      $props.title ? (openBlock(), createElementBlock(
        "h2",
        _hoisted_3$a,
        toDisplayString($props.title),
        1
        /* TEXT */
      )) : createCommentVNode("v-if", true),
      createElementVNode("div", _hoisted_4$8, [
        renderSlot(_ctx.$slots, "default")
      ]),
      createElementVNode("span", {
        class: "clo",
        onClick: _cache[0] || (_cache[0] = (...args) => $options.closeModal && $options.closeModal(...args)),
        title: "\u95DC\u9589"
      }, "X")
    ]),
    createElementVNode("div", {
      class: "bgEvent",
      onClick: _cache[1] || (_cache[1] = (...args) => $options.closeModal && $options.closeModal(...args))
    })
  ]);
}

script$d.render = render$d;
script$d.__scopeId = "data-v-3c6e59cf";
script$d.__file = "src/components/coverComponent/coverComponent.vue";

var script$c = {
  name: "DefaultLayout",
  props: {
    indexPage: { type: String, required: false, default: "" },
    showMenu: { type: Boolean, required: false, default: true },
    testBox: { type: String, required: false }
  }
};

const _hoisted_1$c = { class: "layout-container" };
const _hoisted_2$a = { class: "layout-header" };
const _hoisted_3$9 = { class: "containerBox" };
const _hoisted_4$7 = { class: "layout-footer" };
const _hoisted_5$5 = { key: 0 };
function render$c(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_menuComponent = resolveComponent("menuComponent");
  const _component_listComponent = resolveComponent("listComponent");
  return openBlock(), createElementBlock("div", _hoisted_1$c, [
    createElementVNode("header", _hoisted_2$a, [
      createVNode(_component_menuComponent)
    ]),
    createElementVNode(
      "main",
      {
        class: normalizeClass("layout-main " + $props.indexPage)
      },
      [
        createElementVNode("div", _hoisted_3$9, [
          $props.showMenu ? (openBlock(), createBlock(_component_listComponent, { key: 0 })) : createCommentVNode("v-if", true),
          createCommentVNode(" \u5DE6\u5074 slot\uFF08\u4F8B\u5982\u884C\u4E8B\u66C6\u5340\u584A\uFF09"),
          renderSlot(_ctx.$slots, "coverNoMemu"),
          createCommentVNode(" \u4E3B\u8981\u5167\u5BB9 slot"),
          renderSlot(_ctx.$slots, "conApp")
        ])
      ],
      2
      /* CLASS */
    ),
    createElementVNode("footer", _hoisted_4$7, [
      createElementVNode("p", null, [
        _cache[0] || (_cache[0] = createTextVNode(
          "\xA9 2025 My Website",
          -1
          /* CACHED */
        )),
        !!$props.testBox ? (openBlock(), createElementBlock(
          "b",
          _hoisted_5$5,
          toDisplayString(" " + $props.testBox),
          1
          /* TEXT */
        )) : createCommentVNode("v-if", true)
      ])
    ])
  ]);
}

script$c.render = render$c;
script$c.__scopeId = "data-v-f3fa2e32";
script$c.__file = "src/components/DefaultLayout/DefaultLayout.vue";

const menuStore$1 = container.resolve("menuStore");
var script$b = {
  name: "listComponent",
  data() {
    return { routes: menuStore$1.get() };
  },
  created() {
    if (!this.routes) {
      api.get("/api/menu").then((res) => {
        const menu = res.data;
        menuStore$1.set(menu);
        this.routes = menu;
      });
    }
  }
};

const _hoisted_1$b = { class: "listMenu" };
const _hoisted_2$9 = ["href", "data-lang"];
const _hoisted_3$8 = ["id", "data-lang"];
const _hoisted_4$6 = { key: 2 };
const _hoisted_5$4 = ["href", "data-lang"];
const _hoisted_6$3 = ["id", "data-lang"];
function render$b(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("nav", _hoisted_1$b, [
    createElementVNode("ul", null, [
      (openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList($data.routes, (route) => {
          return openBlock(), createElementBlock("li", {
            key: route.path
          }, [
            createCommentVNode(" \u4F7F\u7528\u6210\u5C0D v-if\uFF0C\u907F\u514D v-else \u89E3\u6790\u554F\u984C"),
            route.path !== "" ? (openBlock(), createElementBlock("a", {
              key: 0,
              href: route.path,
              "data-lang": route.meta.lang
            }, toDisplayString(route.meta.title), 9, _hoisted_2$9)) : createCommentVNode("v-if", true),
            route.path === "" ? (openBlock(), createElementBlock("a", {
              key: 1,
              id: "i18n-" + route.component,
              "data-lang": route.meta.lang
            }, toDisplayString(route.meta.title), 9, _hoisted_3$8)) : createCommentVNode("v-if", true),
            route.children && route.children.length > 0 ? (openBlock(), createElementBlock("ul", _hoisted_4$6, [
              (openBlock(true), createElementBlock(
                Fragment,
                null,
                renderList(route.children, (child) => {
                  return openBlock(), createElementBlock("li", {
                    key: child.path || child.component
                  }, [
                    child.path !== "" ? (openBlock(), createElementBlock("a", {
                      key: 0,
                      href: child.path,
                      "data-lang": child.meta.lang
                    }, toDisplayString(child.meta.title), 9, _hoisted_5$4)) : createCommentVNode("v-if", true),
                    child.path === "" ? (openBlock(), createElementBlock("a", {
                      key: 1,
                      id: "i18n-" + route.component,
                      "data-lang": child.meta.lang
                    }, toDisplayString(child.meta.title), 9, _hoisted_6$3)) : createCommentVNode("v-if", true)
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])) : createCommentVNode("v-if", true)
          ]);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ])
  ]);
}

script$b.render = render$b;
script$b.__scopeId = "data-v-b41a86e2";
script$b.__file = "src/components/listComponent/listComponent.vue";

var script$a = {
  name: "listUseStarTemp",
  props: { items: { type: [Array, Object], required: true, default: () => [] } }
};

const _hoisted_1$a = { class: "userBox" };
const _hoisted_2$8 = { class: "nbr" };
const _hoisted_3$7 = ["onClick"];
function render$a(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_ratingStarComponent = resolveComponent("ratingStarComponent");
  return openBlock(), createElementBlock("ul", _hoisted_1$a, [
    (openBlock(true), createElementBlock(
      Fragment,
      null,
      renderList($props.items, (user, ind) => {
        return openBlock(), createElementBlock("li", {
          key: user.id
        }, [
          createElementVNode("div", null, [
            createElementVNode(
              "b",
              _hoisted_2$8,
              toDisplayString(ind + 1),
              1
              /* TEXT */
            ),
            createElementVNode(
              "span",
              null,
              toDisplayString(user.name) + " - " + toDisplayString(user.age),
              1
              /* TEXT */
            ),
            createElementVNode("span", null, [
              createVNode(_component_ratingStarComponent, {
                score: user.star,
                "onUpdate:score": ($event) => user.star = $event
              }, null, 8, ["score", "onUpdate:score"])
            ]),
            createElementVNode(
              "span",
              null,
              toDisplayString(user.email),
              1
              /* TEXT */
            ),
            createElementVNode(
              "span",
              null,
              toDisplayString(user.date),
              1
              /* TEXT */
            ),
            _ctx.showset ? withDirectives((openBlock(), createElementBlock("b", {
              key: 0,
              class: "showsetBtn",
              onClick: ($event) => _ctx.showModal("\u4FEE\u6539\u7528\u6236\u8CC7\u6599", user),
              title: "\u4FEE\u6539"
            }, [..._cache[0] || (_cache[0] = [
              createElementVNode(
                "i",
                { class: "fa fa-cog" },
                null,
                -1
                /* CACHED */
              )
            ])], 8, _hoisted_3$7)), [
              [vShow, user.age !== "\u4E0D\u63D0\u4F9B"]
            ]) : createCommentVNode("v-if", true)
          ])
        ]);
      }),
      128
      /* KEYED_FRAGMENT */
    ))
  ]);
}

script$a.render = render$a;
script$a.__scopeId = "data-v-5146716f";
script$a.__file = "src/components/listUseStarTemp/listUseStarTemp.vue";

const langStore$1 = container.resolve("languageStore");
var script$9 = {
  name: "loginComponent",
  emits: ["submit", "cancel"],
  setup(_, { emit }) {
    const username = ref("admin");
    const password = ref("123456");
    const onSubmit = (e) => {
      e.preventDefault();
      if (!username.value || !password.value) {
        alert("\u8ACB\u8F38\u5165\u5E33\u865F\u6216\u5BC6\u78BC");
        return;
      }
      emit("submit", { username: username.value, password: password.value });
    };
    const cancelLogin = () => emit("cancel");
    onMounted(() => {
      langStore$1.replaceMenuLang();
    });
    return { username, password, onSubmit, cancelLogin };
  }
};

const _hoisted_1$9 = { for: "username" };
const _hoisted_2$7 = { for: "password" };
const _hoisted_3$6 = { class: "btnBox" };
function render$9(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(
    "form",
    {
      class: "login-form",
      onSubmit: _cache[3] || (_cache[3] = (...args) => $setup.onSubmit && $setup.onSubmit(...args)),
      "aria-label": "\u767B\u5165\u8868\u55AE"
    },
    [
      createElementVNode("label", _hoisted_1$9, [
        _cache[4] || (_cache[4] = createElementVNode(
          "b",
          { "data-lang": "cont_lang_03" },
          "\u5E33\u865F",
          -1
          /* CACHED */
        )),
        withDirectives(createElementVNode(
          "input",
          {
            id: "username",
            type: "text",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.username = $event),
            required: "required",
            autocomplete: "username",
            "data-i18n-placeholder": "cont_lang_01",
            "aria-required": "true"
          },
          null,
          512
          /* NEED_PATCH */
        ), [
          [vModelText, $setup.username]
        ])
      ]),
      createElementVNode("label", _hoisted_2$7, [
        _cache[5] || (_cache[5] = createElementVNode(
          "b",
          { "data-lang": "cont_lang_04" },
          "\u5BC6\u78BC",
          -1
          /* CACHED */
        )),
        withDirectives(createElementVNode(
          "input",
          {
            id: "password",
            type: "password",
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.password = $event),
            required: "required",
            autocomplete: "current-password",
            "data-i18n-placeholder": "cont_lang_02",
            "aria-required": "true"
          },
          null,
          512
          /* NEED_PATCH */
        ), [
          [vModelText, $setup.password]
        ])
      ]),
      createElementVNode("div", _hoisted_3$6, [
        createElementVNode("button", {
          type: "button",
          onClick: _cache[2] || (_cache[2] = (...args) => $setup.cancelLogin && $setup.cancelLogin(...args))
        }, "\u53D6\u6D88"),
        _cache[6] || (_cache[6] = createElementVNode(
          "button",
          {
            type: "submit",
            "data-lang": "cont_lang_05"
          },
          "\u767B\u5165",
          -1
          /* CACHED */
        ))
      ])
    ],
    32
    /* NEED_HYDRATION */
  );
}

script$9.render = render$9;
script$9.__scopeId = "data-v-5e5ecc0f";
script$9.__file = "src/components/loginComponent/loginComponent.vue";

const menuStore = container.resolve("menuStore");
const tokenStore = container.resolve("tokenStore");
const langStore = container.resolve("languageStore");
const permissionStore = container.resolve("permissionStore");
var script$8 = {
  name: "menuComponent",
  data() {
    return {
      routes: menuStore.get() || [],
      showLogin: false,
      langDD: langStore.langData,
      language: langStore.getLanguage(),
      token: tokenStore.get() || "",
      indexUrl: container.resolve("urlUtils").getPageName().toLowerCase()
    };
  },
  created() {
    if (!this.routes.length) {
      api.get("/api/menu").then((res) => {
        const menu = res.data;
        menuStore.set(menu);
        this.routes = menu;
      });
    }
    if (!tokenStore.get()) {
      this.showLogin = true;
    }
  },
  methods: {
    async setLangDD(lang) {
      await langStore.setLanguage(lang);
      this.langDD = langStore.getLangData();
      await nextTick();
      langStore.replaceMenuLang();
    },
    toggleLogin() {
      this.showLogin = !this.showLogin;
    },
    handleLogin(payload) {
      api.post("/api/login", payload).then((res) => {
        if (res.code === 200) {
          const token = res.token;
          tokenStore.set(token);
          const permissions = res.permissions;
          permissionStore.set(permissions);
          location.reload();
        } else {
          alert(res.message);
        }
      });
    },
    cancelLogin() {
      this.showLogin = false;
    },
    logout() {
      tokenStore.clear();
      permissionStore.clear();
      location.reload();
    }
  },
  mounted() {
    this.setLangDD(this.language);
  }
};

const _hoisted_1$8 = { class: "topMenu" };
const _hoisted_2$6 = ["href", "data-lang"];
const _hoisted_3$5 = ["data-lang"];
const _hoisted_4$5 = ["id"];
const _hoisted_5$3 = ["href", "data-lang"];
const _hoisted_6$2 = ["onClick", "id", "data-lang"];
const _hoisted_7$2 = {
  key: 1,
  class: "bgGary"
};
function render$8(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_loginComponent = resolveComponent("loginComponent");
  const _directive_can = resolveDirective("can");
  return openBlock(), createElementBlock("nav", _hoisted_1$8, [
    createElementVNode("ul", null, [
      (openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList($data.routes, (route) => {
          return openBlock(), createElementBlock(
            "li",
            {
              key: route.path,
              class: normalizeClass(route.component.toLowerCase() === $data.indexUrl ? "pickLi" : "")
            },
            [
              route.path !== "" ? (openBlock(), createElementBlock("a", {
                key: 0,
                href: route.path,
                "data-lang": route.meta.lang
              }, null, 8, _hoisted_2$6)) : createCommentVNode("v-if", true),
              route.path === "" ? (openBlock(), createElementBlock("a", {
                key: 1,
                "data-lang": route.meta.lang
              }, toDisplayString($data.langDD[route.meta.lang]), 9, _hoisted_3$5)) : createCommentVNode("v-if", true),
              route.children && route.children.length > 0 ? (openBlock(), createElementBlock("ul", {
                key: 2,
                id: "i18n-" + route.component
              }, [
                (openBlock(true), createElementBlock(
                  Fragment,
                  null,
                  renderList(route.children, (child) => {
                    return openBlock(), createElementBlock("li", {
                      key: child.path || child.component
                    }, [
                      child.path !== "" ? (openBlock(), createElementBlock("a", {
                        key: 0,
                        href: child.path,
                        "data-lang": child.meta.lang
                      }, toDisplayString($data.langDD[child.meta.lang]), 9, _hoisted_5$3)) : createCommentVNode("v-if", true),
                      child.path === "" ? (openBlock(), createElementBlock("a", {
                        key: 1,
                        onClick: ($event) => $options.setLangDD(child.component),
                        id: "i18n-" + child.component,
                        "data-lang": child.meta.lang
                      }, toDisplayString($data.langDD[child.meta.lang]), 9, _hoisted_6$2)) : createCommentVNode("v-if", true)
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ], 8, _hoisted_4$5)) : createCommentVNode("v-if", true)
            ],
            2
            /* CLASS */
          );
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ]),
    withDirectives((openBlock(), createElementBlock("button", {
      class: "login_btn",
      onClick: _cache[0] || (_cache[0] = (...args) => $options.logout && $options.logout(...args))
    }, [..._cache[2] || (_cache[2] = [
      createElementVNode(
        "b",
        null,
        "\u767B\u51FA",
        -1
        /* CACHED */
      )
    ])])), [
      [_directive_can, "post:edit"]
    ]),
    !$data.token ? (openBlock(), createElementBlock("button", {
      key: 0,
      class: "login_btn",
      onClick: _cache[1] || (_cache[1] = (...args) => $options.toggleLogin && $options.toggleLogin(...args))
    }, [..._cache[3] || (_cache[3] = [
      createElementVNode(
        "i",
        {
          class: "fa fa-address-card",
          "aria-hidden": "true"
        },
        null,
        -1
        /* CACHED */
      ),
      createElementVNode(
        "b",
        { "data-lang": "cont_lang_05" },
        "\u767B\u5165",
        -1
        /* CACHED */
      )
    ])])) : createCommentVNode("v-if", true),
    $data.showLogin ? (openBlock(), createElementBlock("div", _hoisted_7$2, [
      createVNode(_component_loginComponent, {
        onSubmit: $options.handleLogin,
        onCancel: $options.cancelLogin
      }, null, 8, ["onSubmit", "onCancel"])
    ])) : createCommentVNode("v-if", true)
  ]);
}

script$8.render = render$8;
script$8.__scopeId = "data-v-753cf7e6";
script$8.__file = "src/components/menuComponent/menuComponent.vue";

var script$7 = {
  name: "modalComponent",
  props: ["title", "data", "editableFields"],
  data() {
    return { localData: Object.assign({}, this.data) };
  },
  methods: {
    handleSave() {
      this.$emit("save", this.localData);
    },
    closeModal() {
      this.$emit("close");
    },
    getInputType(value) {
      if (typeof value === "number") return "number";
      if (typeof value === "string") return value.includes("@") ? "email" : "text";
      if (Object.prototype.toString.call(value) === "[object Date]") return "date";
      return "text";
    },
    isTextField(value) {
      return typeof value === "string" || typeof value === "number";
    },
    isBooleanField(value) {
      return typeof value === "boolean";
    }
  }
};

const _hoisted_1$7 = ["for"];
const _hoisted_2$5 = ["id", "onUpdate:modelValue"];
const _hoisted_3$4 = ["type", "id", "onUpdate:modelValue"];
const _hoisted_4$4 = ["id", "onUpdate:modelValue"];
const _hoisted_5$2 = { class: "actions" };
function render$7(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_coverComponent = resolveComponent("coverComponent");
  return openBlock(), createBlock(_component_coverComponent, {
    title: $props.title,
    onClose: $options.closeModal
  }, {
    default: withCtx(() => [
      createElementVNode(
        "form",
        {
          onSubmit: _cache[1] || (_cache[1] = withModifiers((...args) => $options.handleSave && $options.handleSave(...args), ["prevent"]))
        },
        [
          (openBlock(true), createElementBlock(
            Fragment,
            null,
            renderList($props.editableFields, (field) => {
              return openBlock(), createElementBlock("div", {
                class: "form-item",
                key: field[0]
              }, [
                createElementVNode("label", {
                  for: field[0]
                }, toDisplayString(field[1]), 9, _hoisted_1$7),
                createCommentVNode(" \u907F\u514D v-else \u89E3\u6790\u554F\u984C\uFF0C\u6539\u7528\u76F8\u5BB9\u7684 v-if \u5206\u652F"),
                $options.isBooleanField($data.localData[field[0]]) ? withDirectives((openBlock(), createElementBlock("input", {
                  key: 0,
                  type: "checkbox",
                  id: field[0],
                  "onUpdate:modelValue": ($event) => $data.localData[field[0]] = $event
                }, null, 8, _hoisted_2$5)), [
                  [vModelCheckbox, $data.localData[field[0]]]
                ]) : createCommentVNode("v-if", true),
                $options.isTextField($data.localData[field[0]]) && !$options.isBooleanField($data.localData[field[0]]) ? withDirectives((openBlock(), createElementBlock("input", {
                  key: 1,
                  type: $options.getInputType($data.localData[field[0]]),
                  id: field[0],
                  "onUpdate:modelValue": ($event) => $data.localData[field[0]] = $event
                }, null, 8, _hoisted_3$4)), [
                  [vModelDynamic, $data.localData[field[0]]]
                ]) : createCommentVNode("v-if", true),
                !$options.isTextField($data.localData[field[0]]) && !$options.isBooleanField($data.localData[field[0]]) ? withDirectives((openBlock(), createElementBlock("input", {
                  key: 2,
                  type: "text",
                  id: field[0],
                  "onUpdate:modelValue": ($event) => $data.localData[field[0]] = $event
                }, null, 8, _hoisted_4$4)), [
                  [vModelText, $data.localData[field[0]]]
                ]) : createCommentVNode("v-if", true)
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          )),
          createElementVNode("div", _hoisted_5$2, [
            createElementVNode("button", {
              type: "button",
              onClick: _cache[0] || (_cache[0] = (...args) => $options.closeModal && $options.closeModal(...args))
            }, "\u53D6\u6D88"),
            _cache[2] || (_cache[2] = createElementVNode(
              "button",
              { type: "submit" },
              "\u4FDD\u5B58",
              -1
              /* CACHED */
            ))
          ])
        ],
        32
        /* NEED_HYDRATION */
      )
    ]),
    _: 1
    /* STABLE */
  }, 8, ["title", "onClose"]);
}

script$7.render = render$7;
script$7.__scopeId = "data-v-5a8726e2";
script$7.__file = "src/components/modalComponent/modalComponent.vue";

const tempStore$1 = container.resolve("tempStore");
tempStore$1.set("myTest.name", "\uFF2F\uFF34\uFF34\uFF2F");
var script$6 = {
  name: "newComponent",
  // components: { XXXXXXXXXX },
  props: {},
  data() {
    return {
      myTest: tempStore$1.get().myTest
    };
  },
  methods: {
    say() {
      console.log(this.myTest.name);
      tempStore$1.set("myTest.name", this.myTest.name);
    }
  },
  created() {
    let n = tempStore$1.get() || "\u7121\u540D\u7A31";
    console.log("mytestComponent created:", n);
    console.log(tempStore$1.get().myTest);
  }
};

const _hoisted_1$6 = { class: "mytestComponent-template" };
function render$6(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$6, [
    _cache[2] || (_cache[2] = createElementVNode(
      "h2",
      null,
      "\u65B0\u589EmytestComponent\u5143\u4EF6 ~~~~ 1",
      -1
      /* CACHED */
    )),
    _cache[3] || (_cache[3] = createElementVNode(
      "p",
      null,
      "\u9019\u88E1\u7D81\u5B9A testStore \u8CC7\u6599\u9054\u5230\u8DE8\u5143\u4EF6\u8CC7\u6599\u8655\u7406\u3002",
      -1
      /* CACHED */
    )),
    withDirectives(createElementVNode(
      "input",
      {
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.myTest.name = $event),
        placeholder: "\u8ACB\u8F38\u5165\u6587\u5B57"
      },
      null,
      512
      /* NEED_PATCH */
    ), [
      [vModelText, $data.myTest.name]
    ]),
    createElementVNode("button", {
      class: "btn",
      onClick: _cache[1] || (_cache[1] = (...args) => $options.say && $options.say(...args))
    }, "Submit")
  ]);
}

script$6.render = render$6;
script$6.__scopeId = "data-v-7de6ad4f";
script$6.__file = "src/components/mytestComponent/mytestComponent.vue";

const tempStore = container.resolve("tempStore");
var script$5 = {
  name: "newComponent",
  // components: { XXXXXXXXXX },
  props: {},
  data() {
    return {
      myTest: tempStore.get().myTest || {}
    };
  },
  methods: {},
  created() {
  }
};

const _hoisted_1$5 = { class: "component-template" };
function render$5(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$5, [
    createElementVNode(
      "h2",
      null,
      toDisplayString($data.myTest.name) + " ~~~~~",
      1
      /* TEXT */
    ),
    createElementVNode(
      "p",
      null,
      "\u9019\u662F\u5143\u4EF6 " + toDisplayString($data.myTest.name) + " \u6A21\u677F!!!!!",
      1
      /* TEXT */
    ),
    _cache[0] || (_cache[0] = createElementVNode(
      "p",
      null,
      "\u8CC7\u6599\u662F\u5F9EmytestComponent\u6A21\u677F\u4F7F\u7528store\u66F4\u65B0\uFF0C\u9054\u6210\u8DE8\u5143\u4EF6\u540C\u6B65\u8CC7\u6599",
      -1
      /* CACHED */
    ))
  ]);
}

script$5.render = render$5;
script$5.__scopeId = "data-v-81155522";
script$5.__file = "src/components/newComponent/newComponent.vue";

var script$4 = {
  name: "paginationComponent",
  props: {
    items: { type: [Array, Object], required: true, default: () => [] },
    pageSizeOptions: { type: Array, default: () => [5, 10, 20, 30], validator: (val) => val.every((n) => typeof n === "number") },
    columns: { type: Array, default: () => [] },
    showset: { type: Boolean, default: false }
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 5,
      modalTitle: "",
      modalData: null,
      editableFields: [["id", "\u5E33\u865F"], ["name", "\u66B1\u7A31"], ["age", "\u5E74\u9F61"], ["email", "\u806F\u7D61\u4FE1\u7BB1"]],
      dataFlex: [["id", "\u5E33\u865F", 3], ["name", "\u66B1\u7A31", 5], ["age", "\u5E74\u9F61", 1], ["email", "\u806F\u7D61\u4FE1\u7BB1", 6], ["date", "\u65E5\u671F", 3]]
    };
  },
  computed: {
    normalizedItems() {
      if (Array.isArray(this.items)) return this.items;
      if (this.items && typeof this.items === "object") return Object.values(this.items);
      return [];
    },
    totalPages() {
      return Math.ceil(this.normalizedItems.length / this.pageSize);
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.normalizedItems.slice(start, start + this.pageSize);
    },
    displayColumns() {
      if (this.columns.length > 0) return this.columns;
      const first = this.paginatedItems[0];
      return first ? Object.keys(first) : [];
    },
    fieldDisplayMap() {
      const map = {};
      this.dataFlex.forEach(([key, label, flex = 1]) => {
        map[key] = { label, flex };
      });
      return map;
    }
  },
  methods: {
    changePage(p) {
      this.currentPage = p;
    },
    changeSize(s) {
      this.pageSize = s;
      this.currentPage = 1;
    },
    showModal(title, data) {
      this.modalTitle = title;
      this.modalData = data;
    },
    closeModal() {
      this.modalData = null;
    },
    saveData(updated) {
      const idx = this.items.findIndex((u) => u.id === updated.id);
      if (idx !== -1) {
        this.items[idx] = { ...updated };
      }
      this.closeModal();
    }
  }
};

const _hoisted_1$4 = { class: "pagination-wrapper" };
const _hoisted_2$4 = { class: "controls" };
const _hoisted_3$3 = ["value"];
const _hoisted_4$3 = { class: "userBox" };
const _hoisted_5$1 = { class: "nbr" };
const _hoisted_6$1 = ["onClick"];
const _hoisted_7$1 = { class: "pagination" };
const _hoisted_8$1 = ["disabled"];
const _hoisted_9$1 = ["disabled"];
function render$4(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_modalComponent = resolveComponent("modalComponent");
  return openBlock(), createElementBlock("div", _hoisted_1$4, [
    createElementVNode("div", _hoisted_2$4, [
      createElementVNode("label", null, [
        _cache[4] || (_cache[4] = createTextVNode(
          "\u6BCF\u9801\u986F\u793A\u6578",
          -1
          /* CACHED */
        )),
        withDirectives(createElementVNode(
          "select",
          {
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.pageSize = $event),
            onChange: _cache[1] || (_cache[1] = ($event) => $options.changeSize($data.pageSize))
          },
          [
            (openBlock(true), createElementBlock(
              Fragment,
              null,
              renderList($props.pageSizeOptions, (option) => {
                return openBlock(), createElementBlock("option", {
                  key: option,
                  value: option
                }, toDisplayString(option), 9, _hoisted_3$3);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ],
          544
          /* NEED_HYDRATION, NEED_PATCH */
        ), [
          [
            vModelSelect,
            $data.pageSize,
            void 0,
            { number: true }
          ]
        ])
      ])
    ]),
    createElementVNode("ul", _hoisted_4$3, [
      (openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList($options.paginatedItems, (user, ind) => {
          return openBlock(), createElementBlock("li", {
            key: user.id || ind
          }, [
            createElementVNode("div", null, [
              createElementVNode(
                "b",
                _hoisted_5$1,
                toDisplayString(ind + 1),
                1
                /* TEXT */
              ),
              (openBlock(true), createElementBlock(
                Fragment,
                null,
                renderList($options.displayColumns, (field) => {
                  return openBlock(), createElementBlock(
                    "span",
                    {
                      style: normalizeStyle({ flex: $options.fieldDisplayMap[field]?.flex || 1 }),
                      key: field
                    },
                    toDisplayString(user[field] ?? "\u4E0D\u63D0\u4F9B"),
                    5
                    /* TEXT, STYLE */
                  );
                }),
                128
                /* KEYED_FRAGMENT */
              )),
              $props.showset && user.age !== "\u4E0D\u63D0\u4F9B" ? (openBlock(), createElementBlock("b", {
                key: 0,
                class: "showsetBtn",
                onClick: ($event) => $options.showModal("\u4FEE\u6539\u7528\u6236\u8CC7\u6599", user),
                title: "\u4FEE\u6539"
              }, [..._cache[5] || (_cache[5] = [
                createElementVNode(
                  "i",
                  { class: "fa fa-cog" },
                  null,
                  -1
                  /* CACHED */
                )
              ])], 8, _hoisted_6$1)) : createCommentVNode("v-if", true)
            ])
          ]);
        }),
        128
        /* KEYED_FRAGMENT */
      )),
      createCommentVNode(" \u88DC\u7A7A\u767D\u884C\u8B93\u9AD8\u5EA6\u56FA\u5B9A"),
      (openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList($data.pageSize - $options.paginatedItems.length, (n) => {
          return openBlock(), createElementBlock("li", {
            class: "blank-row",
            key: "blank-" + n
          }, [..._cache[6] || (_cache[6] = [
            createElementVNode(
              "div",
              null,
              "\xA0",
              -1
              /* CACHED */
            )
          ])]);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ]),
    createElementVNode("div", _hoisted_7$1, [
      createElementVNode("button", {
        disabled: $data.currentPage === 1,
        onClick: _cache[2] || (_cache[2] = ($event) => $options.changePage($data.currentPage - 1))
      }, "\u4E0A\u4E00\u9801", 8, _hoisted_8$1),
      createElementVNode(
        "span",
        null,
        "\u7B2C " + toDisplayString($data.currentPage) + " / " + toDisplayString($options.totalPages) + " \u9801",
        1
        /* TEXT */
      ),
      createElementVNode("button", {
        disabled: $data.currentPage === $options.totalPages,
        onClick: _cache[3] || (_cache[3] = ($event) => $options.changePage($data.currentPage + 1))
      }, "\u4E0B\u4E00\u9801", 8, _hoisted_9$1)
    ]),
    $data.modalData ? (openBlock(), createBlock(_component_modalComponent, {
      key: 0,
      title: $data.modalTitle,
      data: $data.modalData,
      "editable-fields": $data.editableFields,
      onClose: $options.closeModal,
      onSave: $options.saveData
    }, null, 8, ["title", "data", "editable-fields", "onClose", "onSave"])) : createCommentVNode("v-if", true)
  ]);
}

script$4.render = render$4;
script$4.__scopeId = "data-v-7eb98b13";
script$4.__file = "src/components/pagination-module/paginationComponent.vue";

var script$3 = {
  name: "PaginationComponent",
  props: {
    items: { type: [Array, Object], required: true, default: () => [] },
    pageSizeOptions: { type: Array, default: () => [5, 10, 20, 30], validator: (val) => val.every((n) => typeof n === "number") },
    columns: { type: Array, default: () => [] },
    showset: { type: Boolean, default: false }
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 5,
      modalTitle: "",
      modalData: null,
      editableFields: [["id", "\u5E33\u865F"], ["name", "\u66B1\u7A31"], ["age", "\u5E74\u9F61"], ["email", "\u806F\u7D61\u4FE1\u7BB1"]],
      dataFlex: [["id", "\u5E33\u865F", 3], ["name", "\u66B1\u7A31", 5], ["age", "\u5E74\u9F61", 1], ["email", "\u806F\u7D61\u4FE1\u7BB1", 6], ["date", "\u65E5\u671F", 3]]
    };
  },
  computed: {
    normalizedItems() {
      if (Array.isArray(this.items)) return this.items;
      if (this.items && typeof this.items === "object") return Object.values(this.items);
      return [];
    },
    totalPages() {
      return Math.ceil(this.normalizedItems.length / this.pageSize);
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.normalizedItems.slice(start, start + this.pageSize);
    },
    displayColumns() {
      if (this.columns.length > 0) return this.columns;
      const first = this.paginatedItems[0];
      return first ? Object.keys(first) : [];
    },
    fieldDisplayMap() {
      const map = {};
      this.dataFlex.forEach(([key, label, flex = 1]) => {
        map[key] = { label, flex };
      });
      return map;
    }
  },
  methods: {
    changePage(p) {
      this.currentPage = p;
    },
    changeSize(s) {
      this.pageSize = s;
      this.currentPage = 1;
    },
    showModal(title, data) {
      this.modalTitle = title;
      this.modalData = data;
    },
    closeModal() {
      this.modalData = null;
    },
    saveData(updated) {
      const idx = this.items.findIndex((u) => u.id === updated.id);
      if (idx !== -1) {
        this.items[idx] = { ...updated };
      }
      this.closeModal();
    }
  }
};

const _hoisted_1$3 = { class: "pagination-wrapper" };
const _hoisted_2$3 = { class: "controls" };
const _hoisted_3$2 = ["value"];
const _hoisted_4$2 = { class: "userBox" };
const _hoisted_5 = { class: "nbr" };
const _hoisted_6 = ["onClick"];
const _hoisted_7 = { class: "pagination" };
const _hoisted_8 = ["disabled"];
const _hoisted_9 = ["disabled"];
function render$3(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_modalComponent = resolveComponent("modalComponent");
  return openBlock(), createElementBlock("div", _hoisted_1$3, [
    createElementVNode("div", _hoisted_2$3, [
      createElementVNode("label", null, [
        _cache[4] || (_cache[4] = createTextVNode(
          "\u6BCF\u9801\u986F\u793A\u6578",
          -1
          /* CACHED */
        )),
        withDirectives(createElementVNode(
          "select",
          {
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.pageSize = $event),
            onChange: _cache[1] || (_cache[1] = ($event) => $options.changeSize($data.pageSize))
          },
          [
            (openBlock(true), createElementBlock(
              Fragment,
              null,
              renderList($props.pageSizeOptions, (option) => {
                return openBlock(), createElementBlock("option", {
                  key: option,
                  value: option
                }, toDisplayString(option), 9, _hoisted_3$2);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ],
          544
          /* NEED_HYDRATION, NEED_PATCH */
        ), [
          [
            vModelSelect,
            $data.pageSize,
            void 0,
            { number: true }
          ]
        ])
      ])
    ]),
    createElementVNode("ul", _hoisted_4$2, [
      (openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList($options.paginatedItems, (user, ind) => {
          return openBlock(), createElementBlock("li", {
            key: user.id || ind
          }, [
            createElementVNode("div", null, [
              createElementVNode(
                "b",
                _hoisted_5,
                toDisplayString(ind + 1),
                1
                /* TEXT */
              ),
              (openBlock(true), createElementBlock(
                Fragment,
                null,
                renderList($options.displayColumns, (field) => {
                  return openBlock(), createElementBlock(
                    "span",
                    {
                      style: normalizeStyle({ flex: $options.fieldDisplayMap[field]?.flex || 1 }),
                      key: field
                    },
                    toDisplayString(user[field] ?? "\u4E0D\u63D0\u4F9B"),
                    5
                    /* TEXT, STYLE */
                  );
                }),
                128
                /* KEYED_FRAGMENT */
              )),
              $props.showset && user.age !== "\u4E0D\u63D0\u4F9B" ? (openBlock(), createElementBlock("b", {
                key: 0,
                class: "showsetBtn",
                onClick: ($event) => $options.showModal("\u4FEE\u6539\u7528\u6236\u8CC7\u6599", user),
                title: "\u4FEE\u6539"
              }, [..._cache[5] || (_cache[5] = [
                createElementVNode(
                  "i",
                  { class: "fa fa-cog" },
                  null,
                  -1
                  /* CACHED */
                )
              ])], 8, _hoisted_6)) : createCommentVNode("v-if", true)
            ])
          ]);
        }),
        128
        /* KEYED_FRAGMENT */
      )),
      createCommentVNode(" \u88DC\u7A7A\u767D\u884C\u8B93\u9AD8\u5EA6\u56FA\u5B9A"),
      (openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList($data.pageSize - $options.paginatedItems.length, (n) => {
          return openBlock(), createElementBlock("li", {
            class: "blank-row",
            key: "blank-" + n
          }, [..._cache[6] || (_cache[6] = [
            createElementVNode(
              "div",
              null,
              "\xA0",
              -1
              /* CACHED */
            )
          ])]);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ]),
    createElementVNode("div", _hoisted_7, [
      createElementVNode("button", {
        disabled: $data.currentPage === 1,
        onClick: _cache[2] || (_cache[2] = ($event) => $options.changePage($data.currentPage - 1))
      }, "\u4E0A\u4E00\u9801", 8, _hoisted_8),
      createElementVNode(
        "span",
        null,
        "\u7B2C " + toDisplayString($data.currentPage) + " / " + toDisplayString($options.totalPages) + " \u9801",
        1
        /* TEXT */
      ),
      createElementVNode("button", {
        disabled: $data.currentPage === $options.totalPages,
        onClick: _cache[3] || (_cache[3] = ($event) => $options.changePage($data.currentPage + 1))
      }, "\u4E0B\u4E00\u9801", 8, _hoisted_9)
    ]),
    $data.modalData ? (openBlock(), createBlock(_component_modalComponent, {
      key: 0,
      title: $data.modalTitle,
      data: $data.modalData,
      "editable-fields": $data.editableFields,
      onClose: $options.closeModal,
      onSave: $options.saveData
    }, null, 8, ["title", "data", "editable-fields", "onClose", "onSave"])) : createCommentVNode("v-if", true)
  ]);
}

script$3.render = render$3;
script$3.__scopeId = "data-v-fa0c1152";
script$3.__file = "src/components/PaginationComponent/PaginationComponent.vue";

var script$2 = {
  name: "ratingStarComponent",
  props: { score: { type: Number, default: 0 }, max: { type: Number, default: 5 } },
  emits: ["update:score"],
  data() {
    return { currentScore: this.score, hoverScore: 0 };
  },
  computed: { stars() {
    return Array.from({ length: this.max }, (_, i) => i + 1);
  } },
  watch: { score(newVal) {
    this.currentScore = newVal;
  } },
  methods: {
    setRating(v) {
      this.currentScore = v;
      this.$emit("update:score", v);
    },
    highlight(v) {
      this.hoverScore = v;
    },
    resetHighlight() {
      this.hoverScore = 0;
    },
    isFilled(i) {
      return this.hoverScore ? i <= this.hoverScore : i <= this.currentScore;
    }
  }
};

const _hoisted_1$2 = {
  class: "rating-stars",
  role: "radiogroup"
};
const _hoisted_2$2 = ["onClick", "onMouseover", "aria-checked"];
function render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("em", _hoisted_1$2, [
    (openBlock(true), createElementBlock(
      Fragment,
      null,
      renderList($options.stars, (star) => {
        return openBlock(), createElementBlock("i", {
          class: normalizeClass(["star", { filled: $options.isFilled(star) }]),
          key: star,
          onClick: ($event) => $options.setRating(star),
          onMouseover: ($event) => $options.highlight(star),
          onMouseleave: _cache[0] || (_cache[0] = (...args) => $options.resetHighlight && $options.resetHighlight(...args)),
          role: "radio",
          "aria-checked": $options.isFilled(star),
          tabindex: "0",
          "aria-label": "\u8A55\u5206\u661F\u7B49"
        }, "\u2605", 42, _hoisted_2$2);
      }),
      128
      /* KEYED_FRAGMENT */
    ))
  ]);
}

script$2.render = render$2;
script$2.__scopeId = "data-v-2f12a46d";
script$2.__file = "src/components/ratingStarComponent/ratingStarComponent.vue";

var script$1 = {
  name: "tableComponent",
  props: ["users", "showset", "editableFields"],
  data() {
    return { modalTitle: "", modalData: null };
  },
  methods: {
    showModal(title, data) {
      this.modalTitle = title;
      this.modalData = data;
    },
    closeModal() {
      this.modalData = null;
    },
    saveData(updatedData) {
      const userIndex = this.users.findIndex((user) => user.id === updatedData.id);
      if (userIndex !== -1) {
        this.users[userIndex] = { ...updatedData };
      }
      this.closeModal();
    }
  }
};

const _hoisted_1$1 = { class: "tableComponent" };
const _hoisted_2$1 = { class: "userBox" };
const _hoisted_3$1 = { class: "nbr" };
const _hoisted_4$1 = ["onClick"];
function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_modalComponent = resolveComponent("modalComponent");
  return openBlock(), createElementBlock("div", _hoisted_1$1, [
    createElementVNode("ul", _hoisted_2$1, [
      (openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList($props.users, (user, ind) => {
          return openBlock(), createElementBlock("li", {
            key: user.id
          }, [
            createElementVNode("div", null, [
              createElementVNode(
                "b",
                _hoisted_3$1,
                toDisplayString(ind + 1),
                1
                /* TEXT */
              ),
              createElementVNode(
                "span",
                null,
                toDisplayString(user.name) + " - " + toDisplayString(user.age),
                1
                /* TEXT */
              ),
              createElementVNode(
                "span",
                null,
                toDisplayString(user.email),
                1
                /* TEXT */
              ),
              createElementVNode(
                "span",
                null,
                toDisplayString(user.date),
                1
                /* TEXT */
              ),
              $props.showset ? withDirectives((openBlock(), createElementBlock("b", {
                key: 0,
                class: "showsetBtn",
                onClick: ($event) => $options.showModal("\u4FEE\u6539\u7528\u6236\u8CC7\u6599", user),
                title: "\u4FEE\u6539"
              }, [..._cache[0] || (_cache[0] = [
                createElementVNode(
                  "i",
                  { class: "fa fa-cog" },
                  null,
                  -1
                  /* CACHED */
                )
              ])], 8, _hoisted_4$1)), [
                [vShow, user.age !== "\u4E0D\u63D0\u4F9B"]
              ]) : createCommentVNode("v-if", true)
            ])
          ]);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ]),
    $data.modalData ? (openBlock(), createBlock(_component_modalComponent, {
      key: 0,
      title: $data.modalTitle,
      data: $data.modalData,
      "editable-fields": $props.editableFields,
      onClose: $options.closeModal,
      onSave: $options.saveData
    }, null, 8, ["title", "data", "editable-fields", "onClose", "onSave"])) : createCommentVNode("v-if", true)
  ]);
}

script$1.render = render$1;
script$1.__scopeId = "data-v-7055feaf";
script$1.__file = "src/components/tableComponent/tableComponent.vue";

const todoStore = container.resolve("todoStore");
var script = {
  name: "todoListComponent",
  data() {
    return { newItem: "", items: todoStore.get() };
  },
  methods: {
    addItem() {
      const text = this.newItem.trim();
      if (!text) return;
      const now = /* @__PURE__ */ new Date();
      const timestamp = now.toLocaleString("zh-TW", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
      todoStore.addItem({ text, createdAt: timestamp });
      this.newItem = "";
    },
    toggleItem(index) {
    },
    removeItem(index) {
      todoStore.removeItem(index);
    }
  }
};

const _hoisted_1 = { class: "todo-container" };
const _hoisted_2 = { class: "todo-list" };
const _hoisted_3 = ["onClick"];
const _hoisted_4 = ["onClick"];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1, [
    _cache[3] || (_cache[3] = createElementVNode(
      "h2",
      null,
      "\u{1F4DD} \u5F85\u8FA6\u6E05\u55AE",
      -1
      /* CACHED */
    )),
    _cache[4] || (_cache[4] = createElementVNode(
      "hr",
      null,
      null,
      -1
      /* CACHED */
    )),
    withDirectives(createElementVNode(
      "input",
      {
        class: "todo-input",
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.newItem = $event),
        type: "text",
        placeholder: "\u8F38\u5165\u5F85\u8FA6",
        onKeyup: _cache[1] || (_cache[1] = withKeys((...args) => $options.addItem && $options.addItem(...args), ["enter"]))
      },
      null,
      544
      /* NEED_HYDRATION, NEED_PATCH */
    ), [
      [vModelText, $data.newItem]
    ]),
    createElementVNode("ul", _hoisted_2, [
      (openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList($data.items, (item, index) => {
          return openBlock(), createElementBlock("li", { key: index }, [
            createElementVNode("span", {
              onClick: ($event) => $options.toggleItem(index)
            }, [
              createTextVNode(
                toDisplayString(item.text),
                1
                /* TEXT */
              ),
              _cache[2] || (_cache[2] = createElementVNode(
                "br",
                null,
                null,
                -1
                /* CACHED */
              )),
              createElementVNode(
                "small",
                null,
                toDisplayString(item.createdAt),
                1
                /* TEXT */
              )
            ], 8, _hoisted_3),
            createElementVNode("button", {
              onClick: ($event) => $options.removeItem(index)
            }, "\u522A\u9664", 8, _hoisted_4)
          ]);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ])
  ]);
}

script.render = render;
script.__scopeId = "data-v-4cac1a7a";
script.__file = "src/components/todoListComponent/todoListComponent.vue";

var vueEntry = {
  install(app) {
    app.component("calendarComponent", script$f);
    app.component("componentTemplate", script$e);
    app.component("coverComponent", script$d);
    app.component("DefaultLayout", script$c);
    app.component("listComponent", script$b);
    app.component("listUseStarTemp", script$a);
    app.component("loginComponent", script$9);
    app.component("menuComponent", script$8);
    app.component("modalComponent", script$7);
    app.component("mytestComponent", script$6);
    app.component("newComponent", script$5);
    app.component("paginationComponent", script$4);
    app.component("PaginationComponent", script$3);
    app.component("ratingStarComponent", script$2);
    app.component("tableComponent", script$1);
    app.component("todoListComponent", script);
  }
};

export { script$c as DefaultLayout, script$3 as PaginationComponent, script$f as calendarComponent, script$e as componentTemplate, script$d as coverComponent, vueEntry as default, script$b as listComponent, script$a as listUseStarTemp, script$9 as loginComponent, script$8 as menuComponent, script$7 as modalComponent, script$6 as mytestComponent, script$5 as newComponent, script$4 as paginationComponent, script$2 as ratingStarComponent, script$1 as tableComponent, script as todoListComponent };
