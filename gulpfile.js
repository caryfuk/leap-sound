var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    less = require('gulp-less'),
    nodemon = require('gulp-nodemon'),
    sourcemaps = require('gulp-sourcemaps'),
    minifyCss = require('gulp-minify-css'),
    browserify = require('browserify'),
    livereload = require('gulp-livereload'),
    source = require('vinyl-source-stream'),
    pkg = require('./package.json');

function getBundleName(suffix) {
  return pkg.name + '-' + pkg.version + suffix;
};

gulp.task('compile-client', function() {
  return browserify({
      debug: true
    })
    .require('./public/src/js/app.js', {
      entry: true
    })
    .bundle().on('error', function(err){
      console.log(err.message);
      this.emit('end');
    })
    .pipe(source(getBundleName('.js')))
    .pipe(gulp.dest('./public/dist'));
});

gulp.task('less', function() {
  gulp.src('public/src/less/style.less')
    .pipe(sourcemaps.init())
    .pipe(less({compress: true}))
    .pipe(autoprefixer())
    .pipe(minifyCss({keepBreaks: false}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/dist/'));
});

gulp.task('watch', function() {
  livereload.listen();

  gulp.watch('public/src/less/**/*.less', ['less']);
  gulp.watch('public/src/js/**/*.js', ['compile-client']);
  gulp.watch(['public/dist/*.*', 'public/*.html']).on('change', livereload.changed);
});

gulp.task('develop', function() {
  nodemon({
    script: 'server.js'
  });
});

gulp.task('default', ['less', 'compile-client', 'watch', 'develop']);
