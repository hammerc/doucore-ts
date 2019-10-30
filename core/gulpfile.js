var gulp = require("gulp");
var rename = require("gulp-rename");
var ts = require("gulp-typescript");
var uglify = require("gulp-uglify");
var del = require('del');

gulp.task("ts", function () {
  var tsProject = ts.createProject("tsconfig.json");
  del.sync(["bin"]);
  return tsProject.src()
    .pipe(tsProject())
    .pipe(gulp.dest("bin"));
});

gulp.task("uglify", function () {
  return gulp.src("bin/dou.js")
    .pipe(uglify())
    .pipe(rename({ basename: "dou.min" }))
    .pipe(gulp.dest("bin"));
});

gulp.task("copy", function () {
  return gulp.src("bin/**/*")
    .pipe(gulp.dest("../examples/lib"))
    .pipe(gulp.dest("../../dou2d-ts/core/lib"))
    .pipe(gulp.dest("../../dou2d-ts/examples/lib"))
    .pipe(gulp.dest("../../dou3d-ts/core/lib"))
    .pipe(gulp.dest("../../dou3d-ts/examples/lib"));
});

gulp.task("default", gulp.series("ts", "uglify", "copy"));
