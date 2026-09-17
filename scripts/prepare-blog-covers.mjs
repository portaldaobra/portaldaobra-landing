#!/usr/bin/env node
/**
 * prepare-blog-covers.mjs — turn raw operator photography into blog cover art.
 *
 * Workflow (see public/static/blog/README.md):
 *   1. Drop `<slug>.jpg|jpeg|png|heic` files into a source directory (one file
 *      per article, named after its blog slug).
 *   2. Run:  node scripts/prepare-blog-covers.mjs [sourceDir]
 *   3. Commit the generated files under public/static/blog/.
 *   4. Run the SQL printed at the end (against the CMS/admin backend, table
 *      name unverified from this repo — confirm it against the backoffice
 *      before running) to point each post's `cover_image` at the new file.
 *
 * Runs locally only (devDependency, never invoked in CI). Never touch
 * `public/static/blog/` by hand — always regenerate through this script so
 * every derivative stays in sync with its source.
 */

import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(REPO_ROOT, "public", "static", "blog");

// Responsive derivatives consumed by CoverImage (src/components/site/CoverImage.tsx).
// Keep this list in sync with RESPONSIVE_WIDTHS there.
const RESPONSIVE_WIDTHS = [640, 1280, 1920];
const FALLBACK_MAX_WIDTH = 1920;
const WEBP_QUALITY = 80;
const JPEG_QUALITY = 82;

const SUPPORTED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".heic"]);

function usage() {
  console.log(
    "Usage: node scripts/prepare-blog-covers.mjs [sourceDir]\n" +
      "  sourceDir defaults to ./blog-covers-incoming (create it and drop <slug>.jpg/.png/.heic files in).",
  );
}

async function listSourceFiles(sourceDir) {
  let entries;
  try {
    entries = await readdir(sourceDir, { withFileTypes: true });
  } catch (err) {
    if (err.code === "ENOENT") {
      console.error(`Source directory not found: ${sourceDir}`);
      usage();
      process.exit(1);
    }
    throw err;
  }
  return entries.filter((e) => e.isFile() && !e.name.startsWith("."));
}

/**
 * Load + normalize one source photo: bake in EXIF orientation, then strip
 * all metadata (GPS, camera make/model, etc.) by never calling
 * `.withMetadata()` on the output pipelines below — sharp omits metadata by
 * default, so the only thing we do explicitly is auto-rotate first so a
 * portrait photo shot sideways doesn't end up stripped-and-sideways.
 */
function loadNormalized(filePath) {
  return sharp(filePath).rotate();
}

async function processFile(entry, sourceDir, results) {
  const ext = path.extname(entry.name).toLowerCase();
  const slug = path.basename(entry.name, ext);
  const filePath = path.join(sourceDir, entry.name);

  if (!SUPPORTED_EXTENSIONS.has(ext)) {
    results.skipped.push({
      file: entry.name,
      reason: `unsupported extension "${ext || "(none)"}"`,
    });
    return;
  }
  if (!slug) {
    results.skipped.push({ file: entry.name, reason: "could not derive a slug from the filename" });
    return;
  }

  try {
    // Fallback <slug>.jpg — the plain `src` every browser can decode, capped
    // at the largest breakpoint so the "original" isn't an unbounded upload.
    await loadNormalized(filePath)
      .resize({ width: FALLBACK_MAX_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: JPEG_QUALITY })
      .toFile(path.join(OUTPUT_DIR, `${slug}.jpg`));

    // Responsive webp derivatives for the srcset.
    for (const width of RESPONSIVE_WIDTHS) {
      await loadNormalized(filePath)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toFile(path.join(OUTPUT_DIR, `${slug}-${width}.webp`));
    }

    results.processed.push({ slug, source: entry.name });
  } catch (err) {
    results.skipped.push({
      file: entry.name,
      reason: `sharp could not read/convert this file (${err.message})`,
    });
  }
}

function printSummary(results) {
  if (results.processed.length > 0) {
    console.log(`\nProcessed ${results.processed.length} cover image(s):`);
    for (const { slug, source } of results.processed) {
      console.log(
        `  ✓ ${source} → ${slug}.jpg + ${RESPONSIVE_WIDTHS.map((w) => `${slug}-${w}.webp`).join(", ")}`,
      );
    }
  }

  if (results.skipped.length > 0) {
    console.log(`\nSkipped ${results.skipped.length} file(s):`);
    for (const { file, reason } of results.skipped) {
      console.log(`  ✗ ${file} — ${reason}`);
    }
  }

  if (results.processed.length === 0) {
    console.log("\nNothing to do — no supported files found.");
    return;
  }

  console.log(
    "\n-- SQL to set cover_image on each post (verify table/column names against\n" +
      "-- the CMS/admin backend first — this script only knows the landing repo's\n" +
      "-- snapshot shape, not the live schema):",
  );
  for (const { slug } of results.processed) {
    console.log(
      `UPDATE blog_posts SET cover_image = '/static/blog/${slug}.jpg' WHERE slug = '${slug}';`,
    );
  }
}

async function main() {
  const sourceDirArg = process.argv[2];
  const sourceDir = sourceDirArg
    ? path.resolve(process.cwd(), sourceDirArg)
    : path.join(REPO_ROOT, "blog-covers-incoming");

  await mkdir(OUTPUT_DIR, { recursive: true });

  const files = await listSourceFiles(sourceDir);
  if (files.length === 0) {
    console.log(`No files found in ${sourceDir}.`);
    usage();
    return;
  }

  const results = { processed: [], skipped: [] };
  for (const entry of files) {
    await processFile(entry, sourceDir, results);
  }

  printSummary(results);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
