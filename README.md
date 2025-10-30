# Vue 3 CDN Starter (GitHub Pages)

這是極簡的 Vue 3（CDN 模式）入門範例，免安裝 Node.js，直接推到 GitHub Pages 即可瀏覽。

- 首頁：`index.html`（使用 ES Module 載入 Vue 3 CDN）
- 已保留：`.nojekyll` 以避免 Jekyll 處理靜態資源

部署到 GitHub Pages
- GitHub → Settings → Pages
  - Build and deployment：Deploy from a branch
  - Branch：`main`
  - Folder：`/(root)`
- Push 後等待數十秒即可在 `https://<你的帳號>.github.io/<repo>/` 看見頁面。

下一步可做什麼
- 新增元件、路由或樣式（仍可維持 CDN 模式）
- 若未來需要 bundler，再改用 Vite 等工具，但現階段非必須。
