/**
 * gulp简单配置
 * 先配置好里面相关的参数
 * 命令：
 * gulp server
 * gulp sass
 * gulp dist
 * gulp ftp
 */

//=================== gulp server =====================
var gulp    	= require('gulp'),
	browserSync = require('browser-sync');

var path_watch = 'src/**/*.+(html|css|js)';
gulp.task('server', function(){
	browserSync({
		files: path_watch,
		browser: "google chrome",
		server: {
			baseDir: "./"
		},
		open: 'external'
	})
})

//=================== gulp sass =====================
var	sass        = require('gulp-ruby-sass'),
	autoprefix  = require('gulp-autoprefixer');

var path_sass = ['src/page/scss/*.scss'];
gulp.task('sass', function(){
	gulp.watch(path_sass, function(){
		sass(path_sass)
		.on('error', sass.logError)
		.pipe(autoprefix())
		.pipe('css/');
	})
})

//===================== gulp dist ===================
var del            = require('del')
	imagemin       = require("gulp-imagemin"),
	jpegRecompress = require("imagemin-jpeg-recompress"),
	pngquant       = require("imagemin-pngquant"),
	minifyCss      = require('gulp-minify-css'),
	uglify         = require('gulp-uglify'),
	concat         = require('gulp-concat');
//del
gulp.task('delDist', function(){
	return del(['dist/**'])
})

//dist
gulp.task('dist', ['delDist'], function(){
	gulp.src('src/**/*.jpg')
	.pipe(imagemin({use:[jpegRecompress({loops:6})]}))
	.pipe(gulp.dest('dist/'))

	gulp.src('src/**/*.png')
	.pipe(imagemin({progressive:false,use:[pngquant()]}))
	.pipe(gulp.dest('dist/'))

	gulp.src('src/**/*.+(gif|mp3|mp4|json)')
	.pipe(gulp.dest('dist/'))

	gulp.src('src/**/*.css')
	.pipe(minifyCss())
	.pipe(gulp.dest('dist/'))

	gulp.src('src/**/*.js')
	.pipe(uglify())
	.pipe(gulp.dest('dist/'))

	gulp.src('src/**/*.html')
	.pipe(gulp.dest('dist/'))
})

//===================== gulp ftp ===================
var replace 	   = require('gulp-replace'),
	iconv          = require('gulp-iconv'),
	ftp 		   = require('gulp-ftp');

gulp.task('delFtp', function(){
	return del('ftp')
})
gulp.task('gbk', ['delFtp'], function(){
	return gulp.src('dist/**')
	.pipe(iconv({
		decoding: 'utf-8',
		encoding: 'GBK'
	}))
	.pipe(replace('<meta charset="UTF-8">','<meta charset="GBK">'))
	.pipe(gulp.dest('ftp'))
})

var path_host   = '',
	path_remote = '',
	uName 		= '',
	uPwd 		= '';
gulp.task('ftp', ['gbk'], function(){
	gulp.src('ftp/**')
	.pipe(ftp({
		host:       path_host,
		remotePath: path_remote,
		user: 		uName,
		pass: 		uPwd
	}))
})