# CyberEd Website

A static frontend plus a Node/Express backend for CyberEd learning modules and lessons.

## Structure

- `frontend/`
  - `assets/` images and audio
  - `src/`
    - `html/` pages (modules, lessons)
    - `css/` styles
    - `js/` scripts
- `backend/`
  - Express API (`src/server.js`) and routes
  - Mongo models and seed scripts

## Run locally

Frontend (use Live Server in VS Code):
1. Open `frontend/src/html/modules.html`
2. Start Live Server (right-click → Open with Live Server)

Backend API:
1. Install deps
2. Create `.env` in `backend/` (copy `.env.example`)
3. Start server

```powershell
# from workspace root
cd .\backend
npm install
npm run dev   # or: node .\src\server.js
```

## Git

This repo tracks all site history. If not already initialized:

```powershell
cd "c:\Users\DELL\Documents\CyberEd Backup"
git init
git add .
git commit -m "Initial commit: restore lessons; fix navigation and asset paths; add .gitignore and README"
```

To push to GitHub (after creating an empty repo `yourname/cybered`):

```powershell
git branch -M main
git remote add origin https://github.com/yourname/cybered.git
git push -u origin main
```

