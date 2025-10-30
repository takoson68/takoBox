# TakoBox Templates

這個專案收納了多個起始模板，可用於未來專案快速啟動與作為基礎參考。

- Static Site：基於 Vite 與 Preact 的靜態網站模板，含 ESLint/Prettier/Nix 等開發配置。
- Node Service：使用 TypeScript 與 Express 的 API 範本，可直接複製 `core/templates/node-service` 後依說明縮減。

每個模板都位在 `core/templates` 底下，並由 `manifest.json` 彙整，供工具或人員參考。

一鍵部署到根目錄（GitHub Pages）
- 在 Windows PowerShell 於倉庫根目錄執行：
  - `./deploy.ps1`（預設使用 `core/templates/static-site`，並以相對 base 打包）
- 自訂模板路徑：
  - `./deploy.ps1 -TemplatePath core/templates/static-site`
- 不加相對 base（預設不建議）：
  - `./deploy.ps1 -NoBase`

腳本會：
- 在指定模板目錄執行 `npm ci` 與建置（預設 `--base=./`），
- 備份根目錄既有 `index.html` 為 `index.backup.<timestamp>.html`，
- 將打包後的 `dist/` 內容複製到倉庫根目錄，
- 確保根目錄存在 `.nojekyll`，
- 最後提示 `git add/commit/push` 以部署到 GitHub Pages（Settings → Pages 選 main 分支 root）。

注意
- GitHub Pages 僅支援靜態內容；需要伺服器的專案（例如 `node-service`）不適用。
- 若你的 repo 名稱不是 `takoBox`，但你仍直接部署在根目錄，預設相對 base (`--base=./`) 仍可正確載入資源。
