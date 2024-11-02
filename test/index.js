import test from "node:test";
import * as puppeteer from "puppeteer";
import * as http from "node:http";
import serveStatic from "serve-static";

test("untouched", async (t) => {
  const browser = await puppeteer.launch();
  t.after(() => browser.close());

  const server = await startTestServer();
  t.after(() => closeTestServer(server));

  const page = await browser.newPage();

  const { port } = server.address();
  await page.goto(`http://localhost:${port}/test.html`);

  await page.evaluate(() => window.runTests());
});

function startTestServer() {
  return new Promise((resolve) => {
    const serve = serveStatic("test");
    const server = http.createServer((req, res) => {
      serve(req, res, () => {
        res.end();
      });
    });
    server.unref();
    server.listen(() => {
      resolve(server);
    });
  });
}

function closeTestServer(server) {
  return new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
