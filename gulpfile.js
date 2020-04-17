const gulp = require('gulp');
const mjml = require('gulp-mjml');
const watch = require('gulp-watch');
const rename = require('gulp-rename');
const del = require('del');
const { execSync } = require('child_process');

const series = gulp.series;
const parallel = gulp.parallel;

function clean(cb) {
    del.sync('./dist');
    cb();
};

function buildLiquid() {
    return gulp.src('mjml/*.mjml')
        .pipe(mjml())
        .pipe(gulp.dest('./dist/'))
};

function openExample(cb) {
    execSync('open ./dist/invoice_created.html || true');
    cb();
};

function dev() {
    watch(['./mjml/**/*.mjml', './data/**/*.json'], { ignoreInitial: false },
        series(buildLiquid));
}

exports.default = series(openExample, dev);
exports.clean = clean;