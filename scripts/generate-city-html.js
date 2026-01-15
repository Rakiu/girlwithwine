import fs from "fs";
import path from "path";
import fetch from "node-fetch";

const DIST_PATH = path.resolve("dist");
const CITY_PATH = path.join(DIST_PATH, "city");

// base HTML template
const createHTML = ({ title, description, canonical }) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <link rel="canonical" href="${canonical}" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/assets/index.js"></script>
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

  cities.forEach((city) => {
    const slug = city.mainCity
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");

    const cityDir = path.join(CITY_PATH, slug);
    fs.mkdirSync(cityDir, { recursive: true });

    const title = city.heading || `Call Girls in ${city.mainCity}`;
    const description =
      city.subDescription ||
      `Book premium call girls in ${city.mainCity}. 24/7 VIP escort service.`;

    const canonical = `https://girlswithwine.com/city/${slug}`;

    const html = createHTML({
      title,
      description,
      canonical,
    });

    fs.writeFileSync(path.join(cityDir, "index.html"), html);
    console.log(`✅ Generated: /city/${slug}/index.html`);
  });
}

generateCityPages();
