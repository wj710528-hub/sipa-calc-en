# Sipa Projector Calculator — English PWA

This is the English-language version of the Sipa projector calculator.

## Functions

- Calculate throw ratio
- Calculate throw distance
- Calculate image diagonal and dimensions
- Support 16:10, 16:9, and 4:3 aspect ratios
- Estimate projected-image brightness in nits using projector brightness, image area, and screen-gain range
- Installable as a Progressive Web App (PWA)
- Offline operation after the first successful online load

## Deploy to GitHub Pages

1. Create a new public repository, for example `sipa-calc-en`.
2. Upload all files in this package to the repository root.
3. Open **Settings → Pages**.
4. Set:
   - **Source:** Deploy from a branch
   - **Branch:** `main`
   - **Folder:** `/ (root)`
5. The public address will normally be:

   `https://YOUR-GITHUB-USERNAME.github.io/sipa-calc-en/`

## Local test

Run:

```bash
python3 -m http.server 8080
```

Then open:

`http://localhost:8080`

## Updating

After replacing files, push the changes to `main`. The service worker cache name is currently:

`Sipa-calc-v3-english`

When publishing a later major version, change the `CACHE` value in `sw.js` so installed copies update cleanly.
