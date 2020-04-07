const fs = require('fs-extra');
const Liquid = require('liquid');
const engine = new Liquid.Engine();
const puppeteer = require('puppeteer');
const libPath = require('path');

async function prepareTestResults() {
    await fs.ensureDir('./test_results');
    await fs.emptyDir('./test_results');
    await fs.copy('./dist/assets', './test_results/assets');
}

async function renderTemplate(name, templateName, data) {
    const path = `./dist/${templateName}.html`;
    const outputPath = `./test_results/${name}.html`;
    const content = await fs.readFile(path, 'utf8');
    const template = await engine.parse(content);
    const result = await template.render(data);

    await fs.writeFile(outputPath, result);

    const browserPath = libPath.join('file://', process.cwd(), outputPath);
    await renderScreenshot(browserPath, name);
};

async function renderScreenshot(url, name) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    await renderPage(page, `screenshots/${name}-800.png`, {
        width: 800,
        height: 600,
    });

    await renderPage(page, `screenshots/${name}-320.png`, {
        width: 320,
        height: 480,
    });
    await browser.close();
};

async function renderPage(page, outputPath, viewport) {
    await page.setViewport(viewport);
    await page.screenshot({
        path: outputPath,
        fullPage: true
    });
}

module.exports = {
    prepareTestResults,
    renderTemplate,
    renderScreenshot
};