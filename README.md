# Vue 3 CDN Starter (GitHub Pages)

這是極簡的 Vue 3（CDN 模式）入門範例，現在已內建 Rollup 打包流程，可將輸出結果發佈到 GitHub Pages。

## 使用方式

1. 安裝依賴：`npm install`
2. 打包輸出：`npm run build`
   - Rollup 會將 `src/entry/index.js`、`src/entry/about.js` 打包成 `docs/assets/js/` 中的 ES Modules。
   - `scripts/postbuild.mjs` 會同步產生 `docs/index.html`、`docs/about.html` 並複製樣式與靜態資產。
3. 將 `docs/` 設定為 GitHub Pages 的發佈目錄即可上線。

## 佈署到 GitHub Pages
- GitHub → Settings → Pages
  - Build and deployment：Deploy from a branch
  - Branch：`main`
  - Folder：`/docs`
- Push 後等待數十秒即可在 `https://<你的帳號>.github.io/<repo>/` 看見頁面。

## 下一步可做什麼
- 依需求擴充 `src/views/` 內的元件與版型。
- 調整 Rollup 設定（例如加入 CSS/PostCSS、壓縮或分包）。
- 若之後改採 SPA 或更多頁面，只要在 `src/entry/` 新增入口並更新 Rollup `input` 即可。
