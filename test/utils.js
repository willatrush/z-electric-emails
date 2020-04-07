const fs = require('fs-extra');
const Liquid = require('liquid');
const engine = new Liquid.Engine();
const puppeteer = require('puppeteer');
const libPath = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function prepareTestResults() {
    await fs.ensureDir('./test_results');
    await fs.emptyDir('./test_results');
    await exec('npm run build');
}

async function renderTemplate(name, templateName, data) {
    const path = `./liquid/${templateName}.html`;
    const outputPath = `./test_results/${name}.html`;
    const content = await fs.readFile(path, 'utf8');
    const template = await engine.parse(content);
    const result = await template.render(data);

    await fs.writeFile(outputPath, result);

    const browserPath = libPath.join('file://', process.cwd(), outputPath);
    return await renderScreenshots(browserPath, name);
};

async function renderScreenshots(url, name) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    const desktop = await renderPage(page, {
        width: 800,
        height: 600,
    });

    const mobile = await renderPage(page, {
        width: 320,
        height: 480,
    });
    await browser.close();
    return { desktop, mobile };
};

async function renderPage(page, viewport) {
    await page.setViewport(viewport);
    return await page.screenshot({
        fullPage: true
    });
}

module.exports = {
    prepareTestResults,
    renderTemplate
};