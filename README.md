# Vue 3 CDN Starter (GitHub Pages)

這是極簡的 Vue 3（CDN 模式）入門範例，現在已內建 Rollup 打包流程，可將輸出結果發佈到 GitHub Pages。

## 使用方式

1. 安裝依賴：`npm install`
2. 打包輸出：`npm run build`
   - Rollup 會將 `src/entry/*.bundle.js`（內含 `@/styles/all.css` 匯入）編譯成 `docs/assets/js/` 中的 ES Modules。
 - `rollup-plugin-postcss` 會把 `src/styles/all.css`（涵蓋全域與元件樣式）整併為 `docs/assets/css/bundle.css`。
  - `scripts/postbuild.mjs` 會產生 `docs/index.html`、`docs/about.html`，調整資源路徑並複製靜態資產。
3. 將 `docs/` 設定為 GitHub Pages 的發佈目錄即可上線。

## API 與 Store
- `src/api/httpClient.js`：小型封裝 `fetch`，預設會在有 store 注入時自動帶上 token，並支援 mock 切換。
- `src/api/mock.js`：集中管理假資料，內建 demo；可用 `registerMock()` 擴充。
- `src/api/config.js`：提供 `setMockEnabled()`、`isMockEnabled()`，或在瀏覽器端設定 `window.__API_USE_MOCK__` 來快速切換。
- `src/api/index.js`：集中定義可呼叫的 API 函式（目前提供 `fetchDemoProfile` 與範例 `fetchMenu`）。
- `src/stores/container.js`：簡化版容器模式，可註冊/解析 store 或服務，並提供 `installContainer()`、`useStore()` 等工具。
- `src/stores/_storeFactory.js`：對 `Vue` reactivity 進行封裝，提供可選 localStorage 持久化的 `createStore()`。
- `src/stores/menuStore.js`、`src/stores/menuStatusStore.js`、`src/stores/tokenStore.js`：使用 `createStore` 建立可持久化的狀態；菜單資料與載入狀態拆分管理，token 亦可統一持久化。
- `src/stores/index.js`：集中註冊所有 store，匯入後即可透過容器使用。
- `src/services/menuService.js`：統一處理菜單載入、格式轉換與 fallback，會更新 `menuStore` 與 `menuStatusStore`。
- `src/app/bootstrap.js`：初始化容器後呼叫 `menuService.loadMenu()`（可走 mock 或後端）寫入 store，所有頁面與元件共享同一份菜單資料。
- 首頁 (`index.html`) 會利用這些 state 顯示菜單載入進度，關閉 mock 後可直接驗證與後端串接的狀態。

## 佈署到 GitHub Pages
- GitHub → Settings → Pages
  - Build and deployment：Deploy from a branch
  - Branch：`main`
  - Folder：`/docs`
- Push 後等待數十秒即可在 `https://<你的帳號>.github.io/<repo>/` 看見頁面。

## 下一步可做什麼
- 依需求擴充 `src/views/` 內的元件與版型。
- 調整 Rollup 設定（例如額外的 PostCSS 處理、壓縮或分包）。
- 若之後改採 SPA 或更多頁面，只要在 `src/entry/` 新增入口並更新 Rollup `input` 即可。
