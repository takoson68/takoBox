# TakoBox — GitHub Pages 直出版本

這個專案已調整為「免建置、免安裝 Node.js」即可在 GitHub Pages 瀏覽。
核心是一個使用 Preact（透過 CDN 載入）的靜態網站範例。

- 首頁（即 Pages 首頁）：`index.html`（根目錄）
- 模板主體：`core/templates/static-site/`
  - `index.html`、`app.js`、`index.css`、`public/favicon.svg`
- 模板清單：`core/templates/manifest.json`（已只保留 static-site）
- 已移除無法在 Pages 運行的 `node-service` 範本（僅伺服器端）

## 如何發布到 GitHub Pages
- 在 GitHub → Settings → Pages：
  - Build and deployment：選擇「Deploy from a branch」
  - Branch：`main`
  - Folder：`/(root)`
- 將本倉庫推上去後，等待數十秒即可在 `https://<你的帳號>.github.io/<repo>/` 看到網站。
- 已包含 `.nojekyll` 以避免 Jekyll 影響靜態資源。

## 專案結構與說明
- `index.html`（根目錄）：使用 CDN 載入 `preact` 與 `htm`，直接在瀏覽器執行。
- `core/templates/static-site/index.html`：同樣採用 CDN 與 ES Modules，無需 bundler。
- `core/templates/static-site/app.js`：App 程式碼（對應原本的 JSX 範例，改用 htm 撰寫）。
- `core/templates/static-site/index.css`：樣式。

## 可選工具（非必須）
先前為了方便，也提供了 `deploy.ps1` 腳本可將打包產物覆蓋到根目錄使用；
目前已不需要建置流程即可瀏覽。如未來你想改回打包部署，可以再使用它。
