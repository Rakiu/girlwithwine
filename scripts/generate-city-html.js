import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CITY_SEO } from "./seo.config.js"; // ✅ SEO CONFIG

/* ---------------- FIX __dirname (ESM) ---------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------- ENV BASED DIST PATH ---------------- */
const DIST_PATH =
  process.env.NODE_ENV === "production"
    ? "/home/USERNAME/public_html"
    : path.resolve(__dirname, "../dist");

const CITY_PATH = path.join(DIST_PATH, "city");
const ASSETS_PATH = path.join(DIST_PATH, "assets");

/* ---------------- CHECK ASSETS ---------------- */
if (!fs.existsSync(ASSETS_PATH)) {
  console.error("❌ Assets folder not found:", ASSETS_PATH);
  console.error("👉 Run `npm run build` first");
  process.exit(1);
}

/* ---------------- DETECT VITE FILES ---------------- */
const assetFiles = fs.readdirSync(ASSETS_PATH);
const jsFile = assetFiles.find((f) => f.endsWith(".js"));
const cssFile = assetFiles.find((f) => f.endsWith(".css"));

if (!jsFile) {
  console.error("❌ JS bundle not found in assets");
  process.exit(1);
}

/* ---------------- HTML ESCAPE ---------------- */
const escapeHTML = (str = "") =>
  String(str)
    .replace(/&/g, "&")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

/* ---------------- HTML TEMPLATE ---------------- */
const createHTML = ({ title, description, canonical, h1 }) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHTML(title)}</title>
  <meta name="description" content="${escapeHTML(description)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${canonical}" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <style>
    .seo-hidden {
      position: absolute;
      left: -9999px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    }
  </style>

  ${cssFile ? `<link rel="stylesheet" href="/assets/${cssFile}" />` : ""}
</head>

<body>
   <h1 class="seo-hidden">${escapeHTML(h1)}</h1>
  

  <div id="root"></div>

  <script type="module" src="/assets/${jsFile}"></script>
</body>
</html>
`;

/* ---------------- MAIN FUNCTION ---------------- */
async function generateCityPages() {
  console.log("📦 Using DIST PATH:", DIST_PATH);

  // ✅ BUILT-IN FETCH (Node 18+)
  const res = await fetch("https://api.girlswithwine.in/api/cities/list");
  const cities = await res.json();

  if (!Array.isArray(cities)) {
    console.error("❌ Cities API failed");
    return;
  }

  if (!fs.existsSync(CITY_PATH)) {
    fs.mkdirSync(CITY_PATH, { recursive: true });
  }

  cities.forEach((city) => {
    if (!city.mainCity) return;

    const slug = city.mainCity
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    const cityDir = path.join(CITY_PATH, slug);
    fs.mkdirSync(cityDir, { recursive: true });

    const seo = CITY_SEO[slug] || {};

    const title =
      seo.title ||
      city.heading ||
      `Call Girls in ${city.mainCity}`;

    const description =
      seo.description ||
      city.subDescription ||
      `Book premium call girls in ${city.mainCity}. 24/7 VIP escort service.`;

    const h1 =
      seo.h1 ||
      city.heading ||
      `Top ${city.mainCity} Call Girls Agency`;

    const canonical = `https://girlswithwine.com/city/${slug}`;

    fs.writeFileSync(
      path.join(cityDir, "index.html"),
      createHTML({ title, description, canonical, h1 })
    );

    console.log(`✅ Generated: /city/${slug}/index.html`);
  });

  console.log("🎉 All city pages generated successfully");
}

generateCityPages();



// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// /* ---------------- FIX __dirname (ESM) ---------------- */
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// /* ---------------- ENV BASED DIST PATH ---------------- */
// const DIST_PATH =
//   process.env.NODE_ENV === "production"
//     ? "/home/USERNAME/public_html"
//     : path.resolve(__dirname, "../dist");

// const CITY_PATH = path.join(DIST_PATH, "city");
// const ASSETS_PATH = path.join(DIST_PATH, "assets");

// /* ---------------- CHECK ASSETS ---------------- */
// if (!fs.existsSync(ASSETS_PATH)) {
//   console.error("❌ Assets folder not found:", ASSETS_PATH);
//   console.error("👉 Run `npm run build` first");
//   process.exit(1);
// }

// /* ---------------- DETECT VITE FILES ---------------- */
// const assetFiles = fs.readdirSync(ASSETS_PATH);
// const jsFile = assetFiles.find((f) => f.endsWith(".js"));
// const cssFile = assetFiles.find((f) => f.endsWith(".css"));

// if (!jsFile) {
//   console.error("❌ JS bundle not found in assets");
//   process.exit(1);
// }

// /* ---------------- HTML ESCAPE ---------------- */
// const escapeHTML = (str = "") =>
//   String(str)
//     .replace(/&/g, "&amp;")
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;")
//     .replace(/"/g, "&quot;")
//     .replace(/'/g, "&#039;");

// /* ---------------- HTML TEMPLATE ---------------- */
// const createHTML = ({ title, description, canonical, h1 }) => `
// <!doctype html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8" />
//   <title>${escapeHTML(title)}</title>
//   <meta name="description" content="${escapeHTML(description)}" />
//   <meta name="robots" content="index, follow" />
//   <link rel="canonical" href="${canonical}" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.0" />

//   <style>
//     .seo-hidden {
//       position: absolute;
//       left: -9999px;
//       width: 1px;
//       height: 1px;
//       overflow: hidden;
//     }
//   </style>

//   ${cssFile ? `<link rel="stylesheet" href="/assets/${cssFile}" />` : ""}
// </head>

// <body>
//   <h1 class="seo-hidden">${escapeHTML(h1)}</h1>
//   <p class="seo-hidden">${escapeHTML(description)}</p>

//   <div id="root"></div>

//   <script type="module" src="/assets/${jsFile}"></script>
// </body>
// </html>
// `;

// /* ---------------- MAIN FUNCTION ---------------- */
// async function generateCityPages() {
//   console.log("📦 Using DIST PATH:", DIST_PATH);

//   const res = await fetch("https://api.girlswithwine.in/api/cities/list");
//   const cities = await res.json();

//   if (!Array.isArray(cities)) {
//     console.error("❌ Cities API failed");
//     return;
//   }

//   if (!fs.existsSync(CITY_PATH)) {
//     fs.mkdirSync(CITY_PATH, { recursive: true });
//   }

//   cities.forEach((city) => {
//     if (!city.mainCity) return;

//     const slug = city.mainCity
//       .toLowerCase()
//       .trim()
//       .replace(/\s+/g, "-")
//       .replace(/-+/g, "-");

//     const cityDir = path.join(CITY_PATH, slug);
//     fs.mkdirSync(cityDir, { recursive: true });

//     /* ---------- SEO FROM API ONLY ---------- */
//     const title =
//       city.heading || `Call Girls in ${city.mainCity}`;

//     const description =
//       city.subDescription ||
//       `Premium escort services available in ${city.mainCity}.`;

//     const h1 =
//       city.heading || `Top ${city.mainCity} Call Girls Agency`;

//     const canonical = `https://girlswithwine.com/city/${slug}`;

//     fs.writeFileSync(
//       path.join(cityDir, "index.html"),
//       createHTML({ title, description, canonical, h1 })
//     );

//     console.log(`✅ Generated: /city/${slug}/index.html`);
//   });

//   console.log("🎉 All city pages generated successfully");
// }

// generateCityPages();
