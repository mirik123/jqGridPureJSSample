"use strict";

var fs = require('fs'),   //fs.createWriteStream(filePath);
    //path = require('path'),   //var filePath = path.resolve(dirs.dist, file);
    gulp = require('gulp');
    //cp = require("child_process");  //cp.fork("node_modules/.bin/mocha");
var jshint = require('gulp-jshint');

// Load all gulp plugins automatically
// and attach them to the `plugins` object
//var plugins = require('gulp-load-plugins')();

// Temporary solution until gulp 4
// https://github.com/gulpjs/gulp/issues/355
//var runSequence = require('run-sequence');

var pkg = require('./package.json');
var dirs = pkg['directories'];
var replace = require("gulp-replace");

gulp.task('clean', function (done) {
    require('gulp-clean')([dirs.dist], done);
    //gulp.src('wwwroot/lib/*').pipe(clean());
});

gulp.task('copy', function () {
    gulp.src(['node_modules/jquery/dist/jquery.js',
        'node_modules/free-jqgrid/js/jquery.jqGrid.src.js',
        'node_modules/free-jqgrid/plugins/grid.odata.js'])
        .pipe(gulp.dest(dirs.dist + '/js/vendor'));

    gulp.src(['node_modules/jquery-ui/jquery-ui.js'])
        .pipe(replace("var jQuery = require('jquery');", ""))
        .pipe(gulp.dest(dirs.dist + '/js/vendor'));

    gulp.src(['node_modules/free-jqgrid/css/ui.jqgrid.css',
        'node_modules/jquery-ui/themes/smoothness/jquery-ui.css'])
        .pipe(gulp.dest(dirs.dist + '/content/vendor'));

    gulp.src(['node_modules/jquery-ui/themes/smoothness/images/*'])
        .pipe(gulp.dest(dirs.dist + '/content/vendor/images'));

    gulp.src([dirs.src + '/*.js'])
        .pipe(gulp.dest(dirs.dist + '/js'));

    gulp.src([dirs.src + '/*.html'])
        .pipe(gulp.dest(dirs.dist));
});

gulp.task('jshint', function () {
    var strjson = fs.readFileSync(".jshintrc", "utf8");
    var options = JSON.parse(strjson);

    return gulp.src(dirs.src + '/*.js')
        //.pipe(plugins.jscs())
        .pipe(jshint(options))
        .pipe(jshint.reporter('default'));
});

gulp.task('default', ['clean','jshint','copy']);
