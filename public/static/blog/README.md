# Blog cover images

Drop-in workflow, mirroring how `public/static/brands/` already serves logos
permanently from the same bucket/CloudFront distribution:

1. Create `blog-covers-incoming/` at the repo root (gitignored — create it
   yourself, it does not ship) and put one photo per article inside it,
   named after the article's **slug**: `<slug>.jpg`, `.jpeg`, `.png`, or
   `.heic`.
2. Run:
   ```bash
   yarn prepare-blog-covers
   # or, to use a different source directory:
   node scripts/prepare-blog-covers.mjs path/to/photos
   ```
   This writes `<slug>.jpg` (fallback) plus `<slug>-640.webp`,
   `<slug>-1280.webp`, `<slug>-1920.webp` (responsive `srcset`) into this
   directory, stripping EXIF (GPS/camera metadata) along the way.
3. Commit the generated files under `public/static/blog/`.
4. Run the `UPDATE ... SET cover_image = '/static/blog/<slug>.jpg' ...` SQL
   the script prints at the end (against the CMS/admin backend) so the post
   picks up the new image.

## Notes

- Filenames are the only place the slug appears — the script does not rename
  or validate against a live database, so a typo in the source filename
  becomes a typo in the SQL it prints. Double-check the slug before running
  the SQL.
- If a post's `cover_image` is empty or the file 404s at runtime, the page
  falls back to today's gradient block automatically
  (`src/components/site/CoverImage.tsx`) — there is no broken-image state.
- Only the derivatives the script produced (`<slug>.jpg` + the three `.webp`
  sizes) are ever required. A post with no matching files here simply keeps
  the gradient.
