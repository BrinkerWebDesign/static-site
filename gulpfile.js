/*
Dependencies
*/

var gulp = require('gulp');
var sass = require('gulp-sass');
var twig = require('gulp-twig');
var imageResize = require('gulp-image-resize');
var imagemin = require('gulp-imagemin');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var bitbucket = require('gulp-gh-pages');
var browserSync = require('browser-sync').create();

/*
Tasks
*/

// Compile SASS
gulp.task('sass', function() {
	return gulp.src('src/scss/main.scss')
	.pipe(sass().on('error', sass.logError))
	.pipe(gulp.dest('site'))
	.pipe(browserSync.stream());
});

// Concat and Uglify JS
gulp.task('scripts', function() {
    return gulp.src('src/script/*.js')
        .pipe(concat('main.js'))
		.pipe(gulp.dest('site'))
		.pipe(rename('main.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('site'))
		.pipe(browserSync.stream());
});

// Compile Twig templates to HTML
gulp.task('twig', function() {
    return gulp.src('src/**/index.twig')
    .pipe(twig())
	.pipe(gulp.dest('site'))
	.pipe(browserSync.stream());
});

// Minify Images
gulp.task('images', function() {
	gulp.src('src/asset/*.{png,jpg,jpeg,gif}')
	.pipe(imageResize({
		imageMagick: true,
		width: 1200,
		upscale: false
	}))
	.pipe(imagemin())
	.pipe(gulp.dest('site/asset'))
	.pipe(browserSync.stream());
});

// Copy App files and vector graphics not included in image minification
gulp.task('copy', function () {
	return gulp.src([
		'src/data/app.json', // JSON DATA API
		'src/contact/**/*', // CONTACT FORM PHP
		'src/asset/*.svg', // SVG LOGOS & GRAPHICS
		'src/asset/*/*',
		'src/asset/*.html',
		'src/vendor/**/*',
		'src/*.html'
	], { base: 'src/' })
		.pipe(gulp.dest('site'))
		.pipe(browserSync.stream());
});

// Clean
gulp.task('clean', function () {
	return gulp.src('site', {read: false})
    .pipe(clean());
});

// Build
gulp.task('build', ['clean','copy','twig','sass','scripts','images']);

// Serve Development Env
gulp.task('serve', ['build'], function() {
	browserSync.init({
		server: "site",
		port: 8000
	});
	gulp.watch("src/**/*.twig", ['twig']);
	gulp.watch("src/scss/*.scss", ['sass']);
	gulp.watch("src/script/*.js", ['scripts']);
	gulp.watch("src/data/app.json", ['copy']);
	gulp.watch("src/*.html", ['copy']);
});


// Deploy to Bitbucket
gulp.task('bitbucket', function () {
    return gulp.src("site/**/*")
	.pipe(bitbucket({
		remoteUrl: "git@bitbucket.org:BrinkerWebDesign/petrochemresource.git",
		branch: "production"
	}));
});

/*
DEFAULT GULP
*/
gulp.task('default', ['serve']);