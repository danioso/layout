var gulp = require('gulp')
  , watchify = require('watchify')
  , rimraf = require('rimraf')
  , browserSync = require('browser-sync')
  , reload = browserSync.reload
  , autoprefixer = require('gulp-autoprefixer')
  , stylus = require('gulp-stylus')
  , nib = require('nib')
  , minifyCss = require('gulp-minify-css')
  , plumber = require('gulp-plumber')
  , rename = require("gulp-rename")
  , header = require('gulp-header');

var path = {
  app: './src/',
  dist: './dist/'
}

var pkg = require('./package.json');
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %> © <%= pkg.author %>',
  ' */',
  ''].join('\n');

// html
gulp.task('html', function(){
    return gulp.src([path.app + 'index.html'], {
      base: path.app
    })
    .pipe(plumber())
    .pipe(gulp.dest(path.dist))
    .pipe(reload({ stream: true }));
});

// stylus
gulp.task('stylus', function(){
    return gulp.src([path.app + 'styles/main.styl'], {
      base: path.app
    })
    .pipe(plumber())
    .pipe(stylus({
      use: nib(),
      "import": ['nib']
    })).pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(header(banner, { pkg : pkg } ))
    .pipe(gulp.dest(path.dist))
    .pipe(reload({ stream: true }));
});

// clean the output directory
gulp.task('clean', function(cb){
    rimraf(config.outputDir, cb);
});

gulp.task('build', ['stylus', 'html'], function() {

  return gulp.src([path.dist + 'styles/main.css'], {
      base: path.app
    })
    .pipe(minifyCss())
    .pipe(header(banner, { pkg : pkg } ))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest(path.dist));

});

gulp.task('watch', ['stylus', 'html'], function() {

  browserSync({
    server: {
      baseDir: path.dist
    }
  });

  gulp.watch(path.app + '**/*.styl', ['stylus']);
  gulp.watch(path.app + 'index.html', ['html']);

});

// WEB SERVER
gulp.task('serve', function () {
  browserSync({
    server: {
      baseDir: path.dist
    }
  });
});
