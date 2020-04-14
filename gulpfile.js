const gulp = require('gulp');
const mjml = require('gulp-mjml');
const watch = require('gulp-watch');
const rename = require('gulp-rename');
const del = require('del');
const { execSync } = require('child_process');

const series = gulp.series;
const parallel = gulp.parallel;

function clean(cb) {
    del.sync('./liquid');
    del.sync('./examples');
    cb();
};

function buildLiquid() {
    return gulp.src('mjml/*.mjml')
        .pipe(mjml())
        .pipe(rename({
            extname: '.html.liquid'
        }))
        .pipe(gulp.dest('./liquid/'))
};

function buildExamples(cb) {
    execSync('node ./scripts/buildExamples.js');
    cb();
};

function openExample(cb) {
    execSync('open ./examples/sign_up_confirmation.html || true');
    cb();
};

function dev() {
    watch('./mjml/**/*.mjml', { ignoreInitial: false },
        series(buildLiquid, buildExamples));
}

exports.default = series(openExample, dev);
exports.clean = clean;