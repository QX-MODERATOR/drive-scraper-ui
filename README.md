# Drive Scraper UI

A modern React frontend for extracting and viewing files from public Google Drive folders.

## Features

- 🚀 Extract files from public Google Drive folders
- 📋 View file list with metadata
- 🔗 Direct download and view links
- 📊 Export to Excel format
- 🎨 Modern, responsive UI

## Prerequisites

- Node.js 18+ and npm

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://your-backend-url.com
```

**Important:** For production deployment on Vercel, set `VITE_API_BASE_URL` in the Vercel dashboard under Environment Variables.

## Build

```bash
npm run build
```

The build output will be in the `dist/` directory.

## Deployment

This project is configured for Vercel deployment:

1. Connect your repository to Vercel
2. Set the environment variable `VITE_API_BASE_URL` in Vercel dashboard
3. Vercel will automatically detect `vercel.json` and deploy

The `vercel.json` configuration:
- Build command: `npm run build`
- Output directory: `dist`
- SPA routing: All routes redirect to `/index.html`

## Project Structure

```
drive-scraper-ui/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── types/          # TypeScript types
│   └── utils/          # Utility functions (API client)
├── public/             # Static assets
├── dist/               # Build output
├── vercel.json         # Vercel configuration
└── package.json        # Dependencies and scripts
```

## License

MIT
