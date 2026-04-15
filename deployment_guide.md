# Deployment Guide

Follow these steps to make your system live.

## 1. Push to GitHub
Since git is not in the system path for me, please run these in your local terminal:

```powershell
cd "d:\Aman Prrogramming\smart college management system"
git init
git add .
git commit -m "Initial commit - Smart College System"
git branch -M main
git remote add origin https://github.com/Aman0050/smart-college-management-system.git
git push -u origin main
```

## 2. Backend (Render.com)
1. Create a **New Web Service**.
2. Connect this GitHub repo.
3. **Root Directory**: `server`
4. **Environment Variables**:
   - `MONGO_URI`: (Your Atlas string)
   - `JWT_SECRET`: (Any random string)
   - `PORT`: `5000`

## 3. Frontend (Vercel.com)
1. Create a **New Project**.
2. Connect this GitHub repo.
3. **Root Directory**: `client`
4. **Environment Variables**:
   - `VITE_API_URL`: (The URL Render gives you, e.g. `https://xxx.onrender.com/api`)
