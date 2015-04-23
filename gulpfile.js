var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename');

// Delete the minify file
gulp.task('clean', function() {
    return gulp.src('src/elevator.min.js')
        .pipe(clean());
});

gulp.task('build', ['clean'], function() {
    return gulp.src('src/elevator.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest('src'));
});
