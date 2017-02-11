var gulp = require('gulp'),
    path = require('path'),
    notify = require('gulp-notify'),
    imagemin = require('gulp-imagemin'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    spritesmith = require('gulp.spritesmith'),
    autoprefixer = require('gulp-autoprefixer'),
    stripCssComments = require('gulp-strip-css-comments'),
    args = require('yargs').argv,
    gulpif = require('gulp-if');
// SASS task
gulp.task('sass', function() {
    return gulp.src('scss/**/*.scss')
        .pipe(sass())
        // .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('css'));
});
// LESS task
// Notice: parameter "--dev" creates source map,
// before commit do not use this parameter
gulp.task('sass', function() {
    return gulp.src('scss/*.scss')
        .pipe(gulpif(args.dev, sourcemaps.init({loadMaps:true})))
        .pipe(sass())
        .pipe(gulpif(args.dev, sourcemaps.write()))
        .pipe(autoprefixer('last 10 versions', '> 1%'))
        .pipe(stripCssComments({
            preserve: false
        }))
        .pipe(gulpif(args.dev, sourcemaps.write('./')))
        .pipe(gulp.dest('css'))
        .pipe(notify('SCSS Compiled <%= file.relative %>'))
});
// Sprite task
gulp.task('sprite', function() {
    var spriteData =
        gulp.src('images/sprite/*.*')
            .pipe(imagemin({
                optimizationLevel: 8,
                progressive: true,
                interlaced: true
            }))
            .pipe(spritesmith({
                imgName: '../images/sprite.png',
                cssName: '_sprite.scss',
                cssFormat: 'scss',
                algorithm: 'binary-tree',
                padding: 10
            }));
    spriteData.img.pipe(gulp.dest('images/'));
    spriteData.css.pipe(gulp.dest('scss/source/'));
});
// Icon fonts
// Before adding icons, they need to resize 500x500
// Resize tool: http://editor.method.ac/
/*var runTimestamp = Math.round(Date.now()/1000);
var fontName = 'Atmall';
gulp.task('iconfont', function(){
    gulp.src(['images/icons/*.svg'])
        .pipe(iconfontCss({
            fontName: fontName,
            cssClass: 'icon-at',
            targetPath: '../../less/source/_icons.less',
            fontPath: '../fonts/atmall/'
        }))
        .pipe(iconfont({
            fontName: fontName, // required
            formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'], // default, 'woff2' and 'svg' are available
            timestamp: runTimestamp // recommended to get consistent builds when watching files
        }))
        .pipe(gulp.dest('fonts/atmall'))
        .pipe(notify('Created <%= file.relative %>'));
});*/
// Watch task
gulp.task('watch', function() {
    // Watch .scss files
    gulp.watch('scss/**/*.scss', ['sass']);
});
// Default task
gulp.task('default', ['watch', 'sass']);