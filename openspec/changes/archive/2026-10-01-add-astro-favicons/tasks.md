# Tasks

## 1. Generate PNG assets

- [x] 1.1 Generate `favicon-32x32.png` and `favicon-16x16.png` from `astro/public/favicon.svg` using ImageMagick or sharp. Verify files exist at `astro/public/` and have correct dimensions (32x32 and 16x16 respectively).

## 2. Add files to repo

- [x] 2.1 Add the generated PNG files to the repository at `astro/public/` and commit. Verify files appear in `git status` and in the `astro/public/` directory.

## 3. Update Astro layout

- [x] 3.1 Modify `astro/src/layouts/Layout.astro` to include PNG link tags:
  - `<link rel="icon" type="image/png" sizes="32x32" href={publicAssetUrl('/favicon-32x32.png')} />`
  - `<link rel="icon" type="image/png" sizes="16x16" href={publicAssetUrl('/favicon-16x16.png')} />`
  Verify the file is updated and builds without syntax errors.

## 4. Local verification

- [x] 4.1 Start the local dev server (`npm run dev` or `astro dev --background`) and verify the favicon loads (check network requests for `/favicon-32x32.png` and `/favicon-16x16.png` and visually inspect browser tab icon).

## 5. Commit and wrap up

- [x] 5.1 Commit the layout change and PNG files together with a clear message. Verify the change builds (`npm run build`) and preview if desired (`npm run preview`).
