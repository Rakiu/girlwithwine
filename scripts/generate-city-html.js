import fs from "fs";
import path from "path";
import fetch from "node-fetch";

const DIST_PATH = path.resolve("/home/USERNAME/public_html");
const CITY_PATH = path.join(DIST_PATH, "city");

// 🔥 detect real Vite assets
const assetsDir = path.join(DIST_PATH, "assets");
const jsFile = fs.readdirSync(assetsDir).find(f => f.endsWith(".js"));
const cssFile = fs.readdirSync(assetsDir).find(f => f.endsWith(".css"));

// 🔐 HTML escape (VERY IMPORTANT)
const escapeHTML = (str = "") =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const createHTML = ({ title, description, canonical }) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />

  <title>${escapeHTML(title)}</title>

  <meta name="description" content="${escapeHTML(description)}" />

  <meta name="robots" content="index, follow" />

  <link rel="canonical" href="${canonical}" />

  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  ${cssFile ? `<link rel="stylesheet" href="/assets/${cssFile}" />` : ""}
</head>

<body>
  <div id="root"></div>

  <!-- ✅ IMPORTANT: production JS -->
  <script type="module" src="/assets/${jsFile}"></script>
</body>
</html>
`;


async function generateCityPages() {
  const res = await fetch("https://api.girlswithwine.in/api/cities/list");
  const cities = await res.json();

  if (!Array.isArray(cities)) {
    console.log("❌ Cities API failed");
    return;
  }

  if (!fs.existsSync(CITY_PATH)) {
    fs.mkdirSync(CITY_PATH, { recursive: true });
  }

  cities.forEach(city => {
    const slug = city.mainCity
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");

    const cityDir = path.join(CITY_PATH, slug);
    fs.mkdirSync(cityDir, { recursive: true });

    const title =
      city.heading || `Call Girls in ${city.mainCity}`;

    const description =
      city.subDescription ||
      `Book premium call girls in ${city.mainCity}. 24/7 VIP escort service.`;

    const canonical = `https://girlswithwine.com/city/${slug}`;

    fs.writeFileSync(
      path.join(cityDir, "index.html"),
      createHTML({
        title,
        description,
        canonical
      })
    );

    console.log(`✅ Generated: /city/${slug}/index.html`);
  });
}

generateCityPages();
