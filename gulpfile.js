var gulp = require('gulp'),
	sass = require('gulp-ruby-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	cssnano = require('gulp-cssnano'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	notify = require('gulp-notify'),
	cache = require('gulp-cache'),
	livereload = require('gulp-livereload'),
	del = require('del');

var directory = {
	css: {
		build: 'build/css',
		dist: 'dist/css',
		public: 'public/css',
		root: 'css',
	},
	js: {
		build: 'build/js',
		dist: 'dist/js',
		public: 'public/js',
		root: 'js',
	},
	img: {
		build: 'build/img',
		dist: 'dist/img',
		public: 'public/img',
		root: 'img',
	},
	fonts: {
		build: 'build/fonts',
		dist: 'dist/fonts',
		public: 'public/fonts',
		root: 'fonts',
	},
	fav: {
		root: './'
	}
}

var app = {
	name: 'sheets',
	names: {
		css: 'sheets.css',
		js: 'sheets.js',
	}
}

/*
| # Scss
|
| The sass files to be converted as css
| and saved to different folders.
|
| @run  gulp sass
|
*/
gulp.task('sass', function () {
	sass('src/sass/themes/*.scss', { style: 'expanded' })
		.pipe(autoprefixer('last 2 version'))
		.pipe(gulp.dest(directory.css.dist))
		.pipe(notify({ message: 'Completed compiling SASS Files' }));

	return sass('src/sass/app.scss', { style: 'expanded' })
		.pipe(autoprefixer('last 2 version'))
		.pipe(rename(app.names.css))
		.pipe(gulp.dest(directory.css.dist))
		.pipe(rename({suffix: '.min'}))
		.pipe(cssnano())
		.pipe(gulp.dest(directory.css.dist))
		.pipe(notify({ message: 'Completed compiling SASS Files' }));
});

/*
| # Scripts
|
| The js files to be concatinated
| and saved to different folders.
|
| @run  gulp scripts
|
*/
gulp.task('scripts', function () {
	return gulp.src('src/js/**/*.js')
		.pipe(concat(app.names.js))
		.pipe(gulp.dest(directory.js.dist))
		.pipe(rename({suffix: '.min'}))
		// .pipe(uglify())
		.pipe(gulp.dest(directory.js.dist))
		.pipe(notify({ message: 'Completed compiling JS Files' }));
});

/*
| # Clean
|
| @run  gulp clean
*/
gulp.task('clean', function () {
	return del(['css', 'js', 'dist/css', 'build']);
});

/*
| # Default Task
|
| @run  gulp default
*/
gulp.task('default', ['clean'], function () {
	gulp.start('sass', 'scripts');
});

/*
| # Watcher
|
| @run  gulp watch
*/
gulp.task('watch', function () {
	// Watch .scss files
	gulp.watch('src/sass/**/*.scss', ['sass']);
	// Watch .js files
	gulp.watch('src/js/**/*.js', ['scripts']);
});