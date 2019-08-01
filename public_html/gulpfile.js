const { src, dest, parallel, series, watch } = require('gulp');  // , series
const pug = require('gulp-pug');
//const less = require('gulp-less');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
//const scss = require('gulp-scss');
const minifyCSS = require('gulp-csso');
const uglify = require("gulp-uglify-es").default;
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const autoprefixer = require('gulp-autoprefixer');
const browsersync = require('browser-sync').create();
const markdown = require('gulp-markdown');
//const jekyll = require('jekyll');


// BrowserSync
function browserSync(done) {
    browsersync.init({
        proxy: 'loc.cakenew:80',
        baseDir: "./",
        open:true,
        notify:false
    });
    done();
}

// BrowserSync Reload
function browserSyncReload(done) {
    browsersync.reload();
    done();
}

// Clean assets
function clean() {
  return del(["./src/"]);
}

function defaultTask(cb) {
    // place code for your default task here
    cb();
}

function html() {
  return src('src/templates/*.pug')
    .pipe(pug())
    .pipe(dest('build/html'))
}
function mdown() {
    return src('src/cnt/md/*.md')
        .pipe(markdown())
        .pipe(dest('build/cnt/html'))
}


function css() {
    return src('src/css/*.sass')
    //.pipe(less())
    .pipe(sass())
    .pipe(autoprefixer({
        cascade: false
    }))
    .pipe(minifyCSS())
    .pipe(dest('build/css'))
}

function jsmerge() {
    return src('src/js/*.js', { sourcemaps: true })
        .pipe(concat('app.merge.js'))
        .pipe(dest('build/js/merge', { sourcemaps: true }))
}
function jsmin(){
    return src('build/js/merge/*.merge.js', { sourcemaps: true })
        .pipe(rename('app.min.js'))
        .pipe(uglify())
        .pipe(dest('build/js', { sourcemaps: true }))
}
/*function js() {
    series(jsmerge, jsmin)
}*/

/*function js() {
  return src('src/js/*.js', { sourcemaps: true })
        .pipe(concat('app.merge.js'))
        .pipe(dest('build/js', { sourcemaps: true }))
}
*/

// Watch files
function watchFiles() {
    watch("src/css/*.sass", css);
    watch("src/js/**/*", series(jsmerge, jsmin));  //series(scriptsLint, scripts)
    watch("src/cnt/md/**/*.md", mdown);//series(scriptsLint, scripts)
    watch(
        [
        "build/css/*.css",
        "src/css/*.sass",
        "src/cnt/md/*.md",
        "src/js/**/*",
        "src/cnt/img/**/*"
//        "./_includes/**/*",
//        "./_layouts/**/*",
//        "./_pages/**/*",
//        "./_posts/**/*",
//        "./_projects/**/*"
        ],
        series(/*jekyll,*/browserSyncReload)
    );
    watch("src/cnt/img/**/*", imagemin);
}

//exports.js = js;
exports.css = css;
exports.html = parallel(html, mdown);
exports.all = parallel(html, css/*, js*/);
exports.default = defaultTask;
exports.watch = parallel(watchFiles, browserSync);