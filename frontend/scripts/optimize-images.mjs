/**
 * 批量压缩站点图片，生成 WebP 与展厅缩略图。
 * 用法：npm run optimize:images
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const SKIP_REL = new Set([
  "images/logo.png",
  "images/icon.png",
  "favicon-32.png",
  "images/museum.png",
  "images/link.png",
  "images/arrow.png",
  "images/view.png",
  "images/b-view.png",
  "images/drag it.png",
  "images/walk.png",
  "images/gallery.png",
  "images/sculpture.png",
  "images/photography.png",
  "images/about.png",
  "images/move-icon.png",
  "images/hand-icon.png",
  "images/gold-frame.png",
  "images/frame.png",
]);

/** @type {Array<{ label: string, files: string[], fullMax?: number, thumbMax?: number, jpegQuality?: number, thumbQuality?: number, webpQuality?: number }>} */
const GROUPS = [
  {
    label: "gallery paintings",
    files: [
      "images/las-meninas.jpg",
      "images/El_Tres_de_Mayo,_by_Francisco_de_Goya,_from_Prado_in_Google_Earth.jpg",
      "images/La_ronda_de_noche,_por_Rembrandt_van_Rijn.jpg",
      "images/Chicks-from-avignon.jpg",
      "images/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg",
      "images/dejeuner-sur-herbe.jpg",
      "images/Van_Eyck_-_Arnolfini_Portrait.jpg",
      "images/liberty-color.jpg",
    ],
    fullMax: 1600,
    thumbMax: 520,
    jpegQuality: 82,
    thumbQuality: 76,
    webpQuality: 80,
  },
  {
    label: "sculpture previews",
    files: [
      "images/sculpture/venus-de-milo.png",
      "images/sculpture/laocoon-and-his-sons.png",
      "images/sculpture/Bird_in_Space.png",
      "images/sculpture/David.png",
      "images/sculpture/Le Baiser.png",
      "images/sculpture/pieta.png",
      "images/sculpture/Winged Victory of Samothrace.png",
    ],
    fullMax: 960,
    thumbMax: 540,
    webpQuality: 82,
  },
  {
    label: "photography prints",
    files: [
      "images/photograph/Migrant Mother.jpg",
      "images/photograph/Behind the Gare Saint-Lazare.jpg",
      "images/photograph/Earthrise.jpg",
      "images/photograph/Lunch Atop a Skyscraper.jpg",
      "images/photograph/Afghan Girl.jpg",
      "images/photograph/Moon and Half Dome.jpg",
      "images/photograph/Untitled Film Stills.jpg",
      "images/photograph/V-J Day in Times Square.jpg",
    ],
    fullMax: 1800,
    thumbMax: 560,
    jpegQuality: 82,
    thumbQuality: 76,
    webpQuality: 80,
  },
  {
    label: "index wall parallax",
    files: ["3d/1.png", "3d/2.png", "3d/3.png", "3d/4.png", "3d/5.png", "3d/6.png", "3d/7.png"],
    fullMax: 1600,
    webpQuality: 82,
  },
  {
    label: "index / entrance assets",
    files: [
      "images/frame2.png",
      "images/liberty-white.png",
      "images/banana-peel.png",
      "images/banana-flesh.png",
      "images/wall-spry.png",
      "images/thinker-co.png",
      "images/think-wh.png",
      "images/about.jpg",
    ],
    fullMax: 1400,
    webpQuality: 82,
  },
  {
    label: "about subscribe",
    files: [
      "images/subscribe/1.png",
      "images/subscribe/1.1.png",
      "images/subscribe/2.png",
      "images/subscribe/2.1.png",
      "images/subscribe/cloud-1.png",
      "images/subscribe/cloud-2.png",
      "images/subscribe/cloud-3.png",
      "images/subscribe/about/1.png",
      "images/subscribe/about/2.png",
      "images/subscribe/about/3.png",
      "images/subscribe/about/4.png",
    ],
    fullMax: 1200,
    webpQuality: 82,
  },
];

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

function thumbPath(relPath) {
  const dir = path.dirname(relPath);
  const base = path.basename(relPath);
  return path.join(dir, "thumbs", base);
}

function webpPath(outputAbs) {
  return outputAbs.replace(/\.(jpe?g|png)$/i, ".webp");
}

async function fileSize(absPath) {
  const stat = await fs.stat(absPath);
  return stat.size;
}

async function buildPipeline(inputAbs, { maxEdge }) {
  let pipeline = sharp(inputAbs, { failOn: "none" }).rotate();
  if (maxEdge) {
    pipeline = pipeline.resize({
      width: maxEdge,
      height: maxEdge,
      fit: "inside",
      withoutEnlargement: true,
    });
  }
  return pipeline;
}

async function writeRaster(inputAbs, outputAbs, { maxEdge, jpegQuality, asThumb = false }) {
  const ext = path.extname(outputAbs).toLowerCase();
  const pipeline = await buildPipeline(inputAbs, { maxEdge });

  if (ext === ".jpg" || ext === ".jpeg") {
    await fs.mkdir(path.dirname(outputAbs), { recursive: true });
    await pipeline
      .jpeg({
        quality: asThumb ? jpegQuality - 4 : jpegQuality,
        mozjpeg: true,
      })
      .toFile(outputAbs);
    return;
  }

  if (ext === ".png") {
    await fs.mkdir(path.dirname(outputAbs), { recursive: true });
    await pipeline
      .png({
        compressionLevel: 9,
        adaptiveFiltering: true,
        palette: asThumb,
        quality: asThumb ? 78 : 90,
      })
      .toFile(outputAbs);
  }
}

async function writeWebp(inputAbs, outputAbs, { maxEdge, webpQuality, asThumb = false }) {
  const pipeline = await buildPipeline(inputAbs, { maxEdge });
  await fs.mkdir(path.dirname(outputAbs), { recursive: true });
  await pipeline
    .webp({
      quality: asThumb ? webpQuality - 6 : webpQuality,
      effort: 4,
      alphaQuality: asThumb ? 78 : 90,
    })
    .toFile(outputAbs);
}

async function replaceIfSmaller(tempAbs, targetAbs, beforeSize) {
  const afterSize = await fileSize(tempAbs);
  if (afterSize < beforeSize) {
    await fs.rename(tempAbs, targetAbs);
    return afterSize;
  }
  await fs.unlink(tempAbs);
  return beforeSize;
}

async function optimizeFile(relPath, options) {
  if (SKIP_REL.has(relPath.replace(/\\/g, "/"))) return null;

  const inputAbs = path.join(ROOT, relPath);
  try {
    await fs.access(inputAbs);
  } catch {
    console.warn(`[skip] missing ${relPath}`);
    return null;
  }

  const jpegQuality = options.jpegQuality ?? 82;
  const webpQuality = options.webpQuality ?? 80;
  const before = await fileSize(inputAbs);
  const tempAbs = `${inputAbs}.opt.tmp${path.extname(inputAbs)}`;

  await writeRaster(inputAbs, tempAbs, {
    maxEdge: options.fullMax,
    jpegQuality,
  });
  const afterRaster = await replaceIfSmaller(tempAbs, inputAbs, before);

  const webpAbs = webpPath(inputAbs);
  await writeWebp(inputAbs, webpAbs, {
    maxEdge: options.fullMax,
    webpQuality,
  });
  const webpSize = await fileSize(webpAbs);

  let thumbWebpSize = 0;
  if (options.thumbMax) {
    const thumbRel = thumbPath(relPath);
    const thumbAbs = path.join(ROOT, thumbRel);
    await writeRaster(inputAbs, thumbAbs, {
      maxEdge: options.thumbMax,
      jpegQuality: options.thumbQuality ?? jpegQuality,
      asThumb: true,
    });

    const thumbWebpAbs = webpPath(thumbAbs);
    await writeWebp(inputAbs, thumbWebpAbs, {
      maxEdge: options.thumbMax,
      webpQuality,
      asThumb: true,
    });
    thumbWebpSize = await fileSize(thumbWebpAbs);
  }

  return {
    relPath,
    before,
    afterRaster,
    webpSize,
    thumbWebpSize,
  };
}

async function main() {
  let totalBefore = 0;
  let totalRaster = 0;
  let totalWebp = 0;
  let totalThumbWebp = 0;

  for (const group of GROUPS) {
    console.log(`\n# ${group.label}`);
    for (const relPath of group.files) {
      const result = await optimizeFile(relPath, group);
      if (!result) continue;
      totalBefore += result.before;
      totalRaster += result.afterRaster;
      totalWebp += result.webpSize;
      totalThumbWebp += result.thumbWebpSize;
      console.log(
        `${result.relPath}: ${formatBytes(result.before)} -> raster ${formatBytes(result.afterRaster)}, webp ${formatBytes(result.webpSize)}${
          result.thumbWebpSize ? `, thumb webp ${formatBytes(result.thumbWebpSize)}` : ""
        }`,
      );
    }
  }

  console.log(
    `\nDone. Raster ${formatBytes(totalBefore)} -> ${formatBytes(totalRaster)}; WebP total ${formatBytes(totalWebp + totalThumbWebp)}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
