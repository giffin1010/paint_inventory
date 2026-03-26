# Paint Inventory App

This project is ready to deploy on Vercel.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy on Vercel

1. Create a GitHub repo and upload this folder.
2. Sign in to Vercel.
3. Click **Add New > Project**.
4. Import the GitHub repo.
5. Keep the default Vite settings:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Click **Deploy**.
7. Open the Vercel URL on your phone and choose **Add to Home Screen**.

## Notes

- Data is currently stored in the browser with localStorage.
- Phone and desktop will not sync unless a backend is added later.
