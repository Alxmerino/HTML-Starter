var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');
var spritesmith = require('gulp.spritesmith');
var merge = require('merge-stream');

var path = {
	src: {
		scss: './src/scss',
		js: './src/js',
		vendor: './src/js/vendor',
		img: './src/img',
		bower: './bower_components'
		node: './node_modules'
	},
	dest: {
		css: './assets/css',
		js: './assets/js',
		img: './assets/img'
	}
}

/**
 * SCSS for development
 */
gulp.task('sass:dev', function () {
	return gulp.src(path.src.scss + '/**/*.scss')
		.pipe(
			sass().on('error', sass.logError)
		)
		.pipe(
			autoprefixer({
				browsers: ['last 2 versions'],
				cascade: false
			})
		)
		.pipe(gulp.dest(path.dest.css));
});

/**
 * SCSS for production
 */
gulp.task('sass', function () {
	return gulp.src(path.src.scss + '/**/*.scss')
		.pipe(
			sass({
				outputStyle: 'compressed'
			})
			.on('error', sass.logError)
		)
		.pipe(
			autoprefixer({
				browsers: ['last 2 versions'],
				cascade: false
			})
		)
		.pipe(gulp.dest(path.dest.css));
});

/**
 * Compile plugins
 */
gulp.task('compile_scripts', function() {
	return gulp.src([
			path.src.vendor + '/jquery/dist/jquery.js',
		])
		.pipe(concat('plugins.js'))
		.pipe(uglify())
		.pipe(gulp.dest(path.dest.js))
});

/**
 * Dev js
 */
gulp.task('main_js:dev', function() {
	return gulp.src(path.src.js + '/main.js')
		.pipe(concat('main.min.js'))
		.pipe(gulp.dest(path.dest.js))
});

/**
 * Compile main js file
 */
gulp.task('main_js', function() {
	return gulp.src(path.src.js + '/main.js')
		.pipe(concat('main.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(path.dest.js))
});

/**
 * Watch task
 */
gulp.task('watch', function () {
	gulp.watch(path.src.scss + '/**/*.scss', ['sass:dev']);
	gulp.watch(path.src.js + '/**/*.js', ['main_js:dev']);
});

/**
 * Sprite task
 */
gulp.task('sprite', function () {
	var spriteData = gulp.src(path.src.img + '/sprites/*.png')
		.pipe(
			spritesmith({
				padding: 5,
				imgPath: '../img/sprites.png',
				imgName: 'sprites.png',
				cssName: '_sprites.scss'
			})
		);

		// Pipe image stream through image optimizer and onto disk
  		var imgStream = spriteData.img
			.pipe(gulp.dest(path.dest.img));

		// Pipe CSS stream through CSS optimizer and onto disk
  		var cssStream = spriteData.css
			.pipe(gulp.dest(path.src.scss + '/components'))

		// Return a merged stream to handle both `end` events
		return merge(imgStream, cssStream);
});

/**
 * Cache breaker task
 */

/**
 * Default task
 */
gulp.task('default', function() {
	runSequence('sprite', 'sass', 'compile_scripts', 'main_js')
});