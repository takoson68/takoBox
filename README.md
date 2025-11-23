# TakoBox 登入入口說明

本專案以瀏覽器內建的 ES Modules + import map 方式載入 Vue 3（`vendors/vue`），入口頁為根目錄下的 `*.html`。`main.js` 會依據 `body[data-page]` / URL 動態載入 `src/pages/*/index.js`，並注入共享容器、API 與語系等依賴。

## 登入層流程
- **顯示入口**：`src/components/menuComponent/` 會在頂部導覽列上放置登入按鈕；若 `tokenStore` 尚無資料，會預設展開遮罩並顯示 `loginComponent` 表單。
- **提交驗證**：`loginComponent` 送出後觸發 `menuComponent.handleLogin`，以 `api.post('/api/login')` 呼叫 Mock/真實 API（預設引用 `vendors/mock/mock.min.js`，因此走 `mock/routes/index.js`）。
- **權限寫入**：登入成功回應 `token` 與 `permissions`，分別寫入 `containers/store/tokenStore.js`、`containers/store/permissionStore.js` 並刷新頁面。
- **權限檢查**：全站透過指令 `v-can`（`containers/directives/v-can.js`）與工具 `permissionUtils.hasPermission` 控制按鈕/區塊可見性。
- **登出/逾時**：手動登出或 API 回傳 `code === 999` 時會清空 Token/Permission（`api/index.js` 攔截器邏輯）並重新整理要求重新登入。
- **預設帳密**：Mock 路由允許 `admin / 123456`（見 `mock/routes/index.js`）。

## 目錄架構（節選）
```text
home.html / about.html / calendar.html ...   # 各頁面入口，載入 main.js
main.js                                      # 依據頁面名稱載入對應 page module
VueContext.js                                # 封裝 Vue ESM，供容器與組件使用
api/
  ApiContainer.js                            # API 容器（策略模式）
  index.js                                   # 實際入口，決定 Mock / Real 策略與攔截器
containers/
  index-dist.js                              # DI 容器：註冊 stores、utils、Vue 匯出
  nanoBox.js                                 # 輕量跨頁狀態容器
  directives/v-can.js                        # 權限指令
  store/                                     # tokenStore、permissionStore、languageStore ...
  utils/permissionUtils.js                   # hasPermission 工具
mock/
  MockApiStrategy.js                         # Mock API 策略
  routes/index.js                            # Mock 路由（含 /api/login）
src/
  pages/                                     # 各頁面入口（home、about、calendar、mtk2mad、playground）
  components/
    menuComponent/                           # 導覽列與登入入口
    loginComponent/                          # 登入表單
    vue-entry.js                             # build 時自動產生的 SFC 安裝器
  layouts/                                   # DefaultLayout 等版型
css/ & sass/                                 # 預編譯樣式與輸出 CSS
lang/                                        # 多語系字典（lang-*.txt）
scripts/generate-vue-index.mjs               # 建置前自動收斂所有 .vue 為 vue-entry.js
```

## 開發與建置
- 安裝依賴：`npm install`
- 編譯組件/資產：`npm run build`（執行 `scripts/generate-vue-index.mjs` + Rollup）
- 預覽：以任意靜態伺服器開啟專案根目錄，再訪問 `home.html`（或 `about.html` 等）。若直接以檔案路徑打開，瀏覽器可能因模組 CORS 限制無法載入。

## 登入相關關鍵檔案
- `src/components/menuComponent/index.js`：登入按鈕、遮罩、送出/登出流程。
- `src/components/loginComponent/index.js`：登入表單（帳號/密碼欄位、emit submit/cancel）。
- `api/index.js`：決定使用 Mock/Real 策略並處理 token 過期。
- `mock/routes/index.js`：Mock 登入與權限回傳；`admin/123456` 為預設可登入帳密。
- `containers/store/tokenStore.js`、`containers/store/permissionStore.js`：登入狀態與權限的本地儲存。
- `containers/directives/v-can.js`、`containers/utils/permissionUtils.js`：依權限碼隱藏元件的判斷。
