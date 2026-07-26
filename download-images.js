// Downloads every image referenced in image-manifest.json to its target
// local path. Run this once from the project root:
//
//   node download-images.js
//
// Safe to re-run — it skips files that already exist, so if it gets
// interrupted partway through you can just run it again.

const fs = require("fs");
const path = require("path");

async function main() {
  const manifestPath = path.join(__dirname, "image-manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

  console.log(`Found ${manifest.length} images to download.\n`);

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const { url, local_path } of manifest) {
    const destPath = path.join(__dirname, local_path);
    const destDir = path.dirname(destPath);

    if (fs.existsSync(destPath)) {
      skipped++;
      continue;
    }

    fs.mkdirSync(destDir, { recursive: true });

    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(destPath, buffer);
      downloaded++;
      process.stdout.write(`Downloaded: ${local_path}\n`);
    } catch (err) {
      failed++;
      console.error(`FAILED: ${local_path} (${url}) — ${err.message}`);
    }
  }

  console.log(`\nDone. Downloaded: ${downloaded}, Skipped (already existed): ${skipped}, Failed: ${failed}`);
  if (failed > 0) {
    console.log("Re-run this script to retry any failed downloads.");
  }
}

main();
