# Wasib Notes v5 (White, Green and Red)

## GitHub par upload (naya repo)
1. Zip ko unzip karein.
2. Naya repo banayein (Public rakhein taake live update chale).
3. Unzip hue folder ki saari cheezein repo mein upload karein: `www`, `scripts`, `signing`, `package.json`, `capacitor.config.json`, `README-GITHUB-APK.md` aur `.github` (computer par folders ko drag and drop karein).
4. Agar folder upload nahi hota: sirf is zip ko repo ke root par upload karein, phir `.github/workflows/android-apk.yml` file GitHub ke Create new file se banakar workflow text paste karein. Workflow zip ko khud kholkar saari files bana deta hai.
5. Actions - Build Android APK - Run workflow. Artifact `Wasib-Notes-debug-APK` download karke install karein.

## Features
Notebooks (H1-H6, paper styles, stickers, images, shapes), PDF open/view/edit/highlight, PDF "Open with", AI Formatting (prompt + auto format on paste), search, pin, duplicate, backup/restore, live update, 100% offline.

## Update
`www/app-body.txt`, `www/css/style.css`, `www/js/app.js`, `www/js/ai/format.js`, `www/js/pdf/*.js` badalne par naya APK nahi chahiye (repo Public ho). `index.html`, `js/boot.js`, `lib/`, icons, config badalne par naya APK chahiye. Signing key `signing/debug.keystore` fixed hai, is liye naya APK purane ke upar update ho jata hai aur data safe rehta hai.

## v6.0.0 redesign notes
- Pastel purple design system (Plus Jakarta Sans bundled locally, Caveat for headings), new app icon set in `www/assets/icons`.
- First-launch name setup (`localStorage` key `wn_name`), editable from Menu > Edit name.
- Developer contact: set links in `CONTACT` inside `www/js/app.js` (currently WhatsApp only).
- AI prompt is now a 2-step chat (asks for extras first). Markdown tables and ```chart JSON blocks are drawn as images on the page.
- Bump `V` in `www/sw.js` and `VER` in `www/js/app.js` on every release.
