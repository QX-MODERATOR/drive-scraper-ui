# 🚀 Drive Scraper UI

This is the frontend user interface for the Drive Scraper tool.

It allows users to paste ANY publicly shared Google Drive **folder or file link** and instantly retrieve:

- ✔ Google Drive file IDs
- ✔ File names
- ✔ Direct view URLs
- ✔ Direct download URLs
- ✔ MIME type
- ✔ Works with "Anyone with link can view"

This UI communicates with the backend API:
`https://drive-scraper-backend.onrender.com/api/extract`

---

## ✨ Features

- Simple interface — paste & extract
- Supports public Drive folders
- Supports direct file links
- Clean JSON result rendering
- Fast response
- Mobile-friendly UI
- No authentication
- No Google API key required
- Works globally

---

## 🛠 Tech Stack

- Vite
- React
- TypeScript
- Fetch API
- CSS

---

## 🧩 System Architecture
```
User → Drive Scraper UI → Drive Scraper Backend → Google Drive
```

### Backend repo:
https://github.com/QX-MODERATOR/drive-scraper-backend

### Frontend repo (this repo):
https://github.com/QX-MODERATOR/drive-scraper-ui

---

## 🌍 API Usage

### POST `/api/extract`

**Body:**
```json
{
  "folderUrl": "https://drive.google.com/drive/folders/XXXXXXXX"
}
```

**Success Response:**
```json
{
  "folderId": "XXXXXXXX",
  "source": "public",
  "files": [
    {
      "id": "AAAAAAA",
      "name": "example.mp4",
      "mimeType": "video/mp4",
      "viewUrl": "...",
      "downloadUrl": "..."
    }
  ]
}
```

**Error Response:**
```json
{
  "error": {
    "code": "INVALID_FOLDER_URL",
    "message": "The provided URL is not a valid Google Drive link."
  }
}
```

---

## 🔧 Local Development Setup
```bash
npm install
npm run dev
```

Create `.env` in root:
```ini
VITE_API_BASE_URL=https://drive-scraper-backend.onrender.com
```

---

## 🏗 Building for Production
```bash
npm run build
```

Output will be placed into:
```
/dist
```

---

## 🚀 Deploying to Vercel

1. Push project to GitHub
2. Go to: https://vercel.com/new
3. Import repo
4. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variable in Vercel:
```ini
   VITE_API_BASE_URL=https://drive-scraper-backend.onrender.com
```
6. Deploy 🎉

---

## 🔥 Example Final System

**Backend:**
```
https://drive-scraper-backend.onrender.com/api/extract
```

**Frontend:**
```
https://drive-scraper-ui.vercel.app
```

---

## 🛡 Privacy & Security

- No login required
- No tokens or OAuth
- We do NOT store any URLs
- All requests are stateless
- Fully anonymous usage

---

## 🧠 Future Enhancements

- Export results as CSV
- Export results as JSON file
- One-click copy IDs
- Click-to-open view link
- Click-to-open download link
- Bulk folder scanning
- UI loading indicators
- Dark mode switch
- Drive link validation instant

---

## 🤝 Contributions

Pull requests are welcome!

If you want to improve UI, performance, or features — feel free to contribute.

---

## 📜 License

MIT License — free to use & modify.

---

## 👨‍💻 Author

**Mohammad (QX-MODERATOR)**

Jordan 🇯🇴

Developer & reverse-engineering & automation enthusiast
