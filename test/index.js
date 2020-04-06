const fs = require('fs');
const fsPromises = fs.promises;
const Liquid = require('liquid');
const engine = new Liquid.Engine();
const ncp = require('ncp').ncp;
const tests = require('./tests');

(async function start() {
    await fsPromises.mkdir('./test_results', { recursive: true });
    await copyAssets();

    for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        await renderTemplate(test.name, test.template, test.data);
    }
})().catch(err => {
    console.log(err);
    promise.exit(1);
});

function copyAssets() {
    return new Promise((resolve, reject) => {
        ncp('./dist/assets', './test_results/assets', err => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

async function renderTemplate(name, templateName, data) {
    const path = `./dist/${templateName}`;
    const outputPath = `./test_results/${name}`;
    const content = await fsPromises.readFile(path, 'utf8');
    const template = await engine.parse(content);
    const result = await template.render(data);

    await fsPromises.writeFile(outputPath, result);
};