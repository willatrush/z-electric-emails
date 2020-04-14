const fs = require('fs-extra');
const Liquid = require('liquid');
const path = require('path');
const replaceExt = require('replace-ext');
const examples = require('../examples');

const engine = new Liquid.Engine();
engine.registerFileSystem(new Liquid.LocalFileSystem('./liquid/partials'));

(async () => {
    const dir = './liquid';
    const output = './examples';

    await fs.ensureDir(output);

    const files = (await fs.readdir(dir, { withFileTypes: true }))
        .filter(dirent => dirent.isFile())
        .map(x => x.name);

    const map = {};
    for (let file of files) {
        const name = file.split('.')[0];
        const p = path.join(dir, file);
        const content = await fs.readFile(p, 'utf8');
        const template = await engine.parse(content);
        map[name] = template;
    }

    for (let example of examples) {
        const template = map[example.template];
        const data = example.data;
        const html = await template.render(data);
        const outputPath = path.join(output, `${example.name}.html`);
        await fs.writeFile(outputPath, html);
    }
})().catch((err) => {
    console.error(err);
    process.exit(1);
});