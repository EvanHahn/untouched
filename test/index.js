const puppeteer = require("puppeteer");
const path = require("path");
const { pathToFileURL } = require("url");

async function main() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  const testPagePath = path.join(__dirname, "test.html");
  await page.goto(pathToFileURL(testPagePath));

  const resultEl = await page.waitForSelector("#result", { timeout: 5000 });
  const result = await resultEl?.evaluate((el) => el.textContent);

  await browser.close();

  if (result !== "ok") {
    throw new Error(result);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
